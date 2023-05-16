#!/bin/bash

REPORTS_FOLDER_NAME=reports

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
  echo "Contents: $file1 $file_name and $TIMESTAMP"
  
  if [ "${file1##*/}" == "Dockerfile" ]
  then
    echo "TBD"
    # hadolint-checker /dockerfiles/Dockerfile
  else
    echo "Error: Could not detect file type or unsupported file type."
  fi
done
