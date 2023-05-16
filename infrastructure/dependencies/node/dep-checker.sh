#!/bin/bash

REPORTS_FOLDER_NAME=reports
PACKAGE_FILE_NAME=package.json
PACKAGE_LOCK_FILE_NAME=package-lock.json

mkdir -p $REPORTS_FOLDER_NAME

# Read the dependencies from the JSON file
dependencies=$(/usr/bin/jq -c '.dependencies[]' ./dependencies.json)

# Loop over the dependencies
for dependency in $dependencies
do

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`

  # Extract the dependency arguments using jq
  file1=$(echo "$dependency" | jq -r '.file1')
  file2=$(echo "$dependency" | jq -r '.file2')
  file_name=$(echo "$dependency" | jq -r '.file_name')

  # Print arguments
  echo "Contents: $file1, $file2, $file_name and $TIMESTAMP"
  
  if [ "${file1##*/}" == $PACKAGE_FILE_NAME ] && [[ "$file2" ]] && [ "${file2##*/}" == $PACKAGE_LOCK_FILE_NAME ]
  then
    echo "Detected Node.js package.json and package-lock.json files. Installing dependencies using npm ci with node 14"
    curl --silent -O $file1
    curl --silent -O $file2
    npm --silent ci
    npm audit --json > "./"${REPORTS_FOLDER_NAME}"/"$file_name"__node_14__"$TIMESTAMP".json"
    echo "Saved report file to ./"${REPORTS_FOLDER_NAME}"/"$file_name"__node_14__"$TIMESTAMP".json"
    rm -rf ./node_modules
    echo "Removed /node_modules"
  elif [ "${file1##*/}" == $PACKAGE_FILE_NAME ]
  then
    echo "Detected Node.js package.json file. Installing dependencies using npm install with node 14"
    curl --silent -O $file1
    npm --silent install
    npm audit --json > "./"${REPORTS_FOLDER_NAME}"/"$file_name"__node_14__"$TIMESTAMP".json"
    echo "Saved report file to ./"${REPORTS_FOLDER_NAME}"/"$file_name"__node_14__"$TIMESTAMP".json"
    rm -rf ./node_modules
    rm package-lock.json
    echo "Removed package-lock.json and /node_modules"
  else
    echo "Error: Could not detect file type or unsupported file type."
  fi
done
