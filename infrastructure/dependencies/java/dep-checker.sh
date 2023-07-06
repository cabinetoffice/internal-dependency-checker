#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=java
REPORTS_FOLDER_NAME=reports/java
POM_FILE_NAME=pom.xml

mkdir -p $REPORTS_FOLDER_NAME

dependencies=$(set_dependencies_object $LANG_NAME)

# shellcheck disable=SC2154
# `file1` and `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "$dependency"
  print_arguments

  report_file_name=$(set_file_name "pom_xml")
  
  if [[ "${file1##*/}" == "$POM_FILE_NAME" ]]; then
    echo "Detected pom.xml file. Checking dependencies using dependency-check:check"
    cd "${WORKDIR}/${repo_file_path}" || continue
    mvn clean install
    dependency-check.sh --scan "target/**/*.jar" --format "JSON" --out "$report_file_name"
    echo "Saved report to ${report_file_name}"
  else
    print_error "FILE" > "$report_file_name"
  fi
done
