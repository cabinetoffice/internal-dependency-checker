#!/bin/bash

REPORTS_FOLDER_NAME=reports/python
REQUIREMENTS_FILE_NAME=requirements.txt
WORKDIR=/repo-dependency-checker

mkdir -p $REPORTS_FOLDER_NAME

# Read the dependencies from the JSON file
dependencies=$(/usr/bin/jq -c '.python[] | {file1: .file1, file_name: .file_name, repo_file_path: .repo_file_path}' ./repos/state.json)

# Loop over the dependencies
for dependency in $dependencies
do

  # Extract the dependency arguments using jq
  file1=$(echo "$dependency" | jq -r '.file1')
  file_name=$(echo "$dependency" | jq -r '.file_name')
  repo_file_path=$(echo "$dependency" | jq -r '.repo_file_path')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME=${WORKDIR}"/"${REPORTS_FOLDER_NAME}"/"$file_name"__pip3_install__"$TIMESTAMP".json"

  # Print arguments
  echo "Contents: $file1, $repo_file_path, $file_name and $TIMESTAMP"
  
  if [ "${file1##*/}" == $REQUIREMENTS_FILE_NAME ]
  then
    echo "Installing python dependencies using pip3 install -r requirements.txt --quiet --no-cache-dir"
    cd $WORKDIR"/"$repo_file_path
    python3 -m venv my_env_$TIMESTAMP
    . my_env_$TIMESTAMP/bin/activate
    pip3 install -r requirements.txt --quiet --no-cache-dir
    pip3 install pip-audit
    pip-audit -r requirements.txt -f json -o $REPORT_FILE_NAME
    echo "Saved report file to $REPORT_FILE_NAME"
    deactivate
    # cd $WORKDIR
  else
    echo {'"error"' : '"'Error: Could not detect file type ${file1}'"'} > $REPORT_FILE_NAME
  fi
done
