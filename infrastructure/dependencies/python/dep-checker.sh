#!/bin/bash

REPORTS_FOLDER_NAME=reports
REQUIREMENTS_FILE_NAME=requirements.txt

mkdir -p $REPORTS_FOLDER_NAME

# Read the dependencies from the JSON file
dependencies=$(/usr/bin/jq -c '.dependencies[]' ./dependencies.json)

# Loop over the dependencies
for dependency in $dependencies
do

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`

  # Extract the dependency arguments using jq
  file1=$(echo "$dependency" | jq -r '.file1')
  file_name=$(echo "$dependency" | jq -r '.file_name')

  # Print arguments
  echo "Contents: $file1, $file_name and $TIMESTAMP"
  
  if [ "${file1##*/}" == $REQUIREMENTS_FILE_NAME ]
  then
    echo "Installing python dependencies using pip3 install -r requirements.txt --quiet --no-cache-dir"
    curl --silent -O $file1
    python3 -m venv my_env_$TIMESTAMP
    . my_env_$TIMESTAMP/bin/activate
    pip3 install -r requirements.txt --quiet --no-cache-dir
    pip3 install pip-audit
    pip-audit -r requirements.txt -f json -o "./"${REPORTS_FOLDER_NAME}"/"$file_name"__pip3_install__"$TIMESTAMP".json"
    echo "Saved report file to ./"${REPORTS_FOLDER_NAME}"/"$file_name"__pip3_install__"$TIMESTAMP".json"
    deactivate
  else
    echo "Error: Could not detect file type or unsupported file type."
  fi
done
