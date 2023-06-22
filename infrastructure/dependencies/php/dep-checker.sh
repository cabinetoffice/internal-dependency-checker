#!/bin/bash

REPORTS_FOLDER_NAME=reports/php
COMPOSER_FILE_NAME=composer.json
COMPOSER_LOCK_FILE_NAME=composer.lock
WORKDIR=/repo-dependency-checker

mkdir -p $REPORTS_FOLDER_NAME

# Read the dependencies from the JSON file
dependencies=$(/usr/bin/jq -c '.php[] | {file1: .file1, file2: .file2, file_name: .file_name, repo_file_path: .repo_file_path}' ./repos/state.json)


# Loop over the dependencies
for dependency in $dependencies
do

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`

  # Extract the dependency arguments using jq
  file1=$(echo "$dependency" | jq -r '.file1')
  file2=$(echo "$dependency" | jq -r '.file2')
  file_name=$(echo "$dependency" | jq -r '.file_name')
  repo_file_path=$(echo "$dependency" | jq -r '.repo_file_path')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME=${WORKDIR}"/"${REPORTS_FOLDER_NAME}"/"$file_name"__php_7.4__"$TIMESTAMP".json"

  # Print arguments
  echo "Contents: $file1, $file2, $file_name, $repo_file_path and $TIMESTAMP"

  if [ "${file1##*/}" == $COMPOSER_FILE_NAME ] && [[ "$file2" ]] && [ "${file2##*/}" == $COMPOSER_LOCK_FILE_NAME ]
  then
    echo "Detected $COMPOSER_FILE_NAME and $COMPOSER_LOCK_FILE_NAME files. Immediately auditing dependencies"
    cd $WORKDIR"/"$repo_file_path
    composer audit --format=json > "$REPORT_FILE_NAME"
    echo "Saved report file to $REPORT_FILE_NAME"
  elif [ "${file1##*/}" == $COMPOSER_FILE_NAME ]
  then
    echo "Detected $COMPOSER_FILE_NAME only. Re-generating $COMPOSER_LOCK_FILE_NAME and auditing dependencies"
    cd $WORKDIR"/"$repo_file_path
    composer update
    composer audit --format=json > "$REPORT_FILE_NAME"
    echo "Saved report file to $REPORT_FILE_NAME"
  else
    echo {'"error"' : '"'Error: Could not detect files type ${file1} and ${file2}'"'} > $REPORT_FILE_NAME
  fi
done
