#!/bin/bash

REPORTS_FOLDER_NAME=reports/node
PACKAGE_FILE_NAME=package.json
PACKAGE_LOCK_FILE_NAME=package-lock.json
WORKDIR=/repo-dependency-checker

mkdir -p $REPORTS_FOLDER_NAME

# Read the dependencies from the JSON file
dependencies=$(/usr/bin/jq -c '.node[] | {file1: .file1, file2: .file2, file_name: .file_name, repo_file_path: .repo_file_path}' ./repos/state.json)

# Loop over the dependencies
for dependency in $dependencies
do

  # Extract the dependency arguments using jq
  file1=$(echo "$dependency" | jq -r '.file1')
  file2=$(echo "$dependency" | jq -r '.file2')
  file_name=$(echo "$dependency" | jq -r '.file_name')
  repo_file_path=$(echo "$dependency" | jq -r '.repo_file_path')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME=${WORKDIR}"/"${REPORTS_FOLDER_NAME}"/"$file_name"__node_14__"$TIMESTAMP".json"

  # Print arguments
  echo "Contents: $file1, $file2, $file_name, $repo_file_path and $TIMESTAMP"
  
  if [ "${file1##*/}" == $PACKAGE_FILE_NAME ] && [[ "$file2" ]] && [ "${file2##*/}" == $PACKAGE_LOCK_FILE_NAME ]
  then
    echo "Detected Node.js package.json and package-lock.json files. Installing dependencies using npm ci with node 14"
    cd $WORKDIR"/"$repo_file_path
    npm --silent ci
    npm audit --json > $REPORT_FILE_NAME
    echo "Saved report file to $REPORT_FILE_NAME"
    rm -rf ./node_modules
    echo "Removed /node_modules"
  elif [ "${file1##*/}" == $PACKAGE_FILE_NAME ]
  then
    echo "Detected Node.js package.json file. Installing dependencies using npm install with node 14"
    cd $WORKDIR"/"$repo_file_path
    npm --silent install
    npm audit --json > $REPORT_FILE_NAME
    echo "Saved report file to $REPORT_FILE_NAME"
    rm -rf ./node_modules
    rm package-lock.json
    echo "Removed package-lock.json and /node_modules"
  else
    echo {'"error"' : '"'Error: Could not detect files type ${file1} and ${file2}'"'} > $REPORT_FILE_NAME
  fi
done
