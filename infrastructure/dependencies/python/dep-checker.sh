#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=python
REPORTS_FOLDER_NAME=reports/python
REQUIREMENTS_FILE_NAME=requirements.txt

mkdir -p $REPORTS_FOLDER_NAME

dependencies=$(set_dependencies_object $LANG_NAME)

# shellcheck disable=SC2154
# `file1` and `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "$dependency"
  print_arguments

  report_file_name=$(set_file_name "pip_audit")
  
  if [[ "${file1##*/}" == "$REQUIREMENTS_FILE_NAME" ]]; then
    echo "Installing python dependencies using pip3 install -r requirements.txt --quiet --no-cache-dir"
    cd "${WORKDIR}/${repo_file_path}" || continue
    python3 -m venv my_env_"$TIMESTAMP"
    # shellcheck source=./my_env_"$TIMESTAMP"/bin/activate
    . my_env_"$TIMESTAMP"/bin/activate
    pip3 install -r requirements.txt --quiet --no-cache-dir
    pip3 install pip-audit
    pip-audit -r requirements.txt -f json -o "$report_file_name"
    echo "Saved report to $report_file_name"
    deactivate
    rm -rf "my_env_$TIMESTAMP"
  else
    print_error "FILE" > "$report_file_name"
  fi
done
