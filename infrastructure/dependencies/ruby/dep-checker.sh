#!/bin/bash

REPORTS_FOLDER_NAME=reports
GEMFILE_FILE_NAME=Gemfile
GEMFILE_LOCK_FILE_NAME=Gemfile.lock

mkdir -p $REPORTS_FOLDER_NAME
gem install bundler-audit --no-user-install

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
  
  if [ "${file1##*/}" == $GEMFILE_FILE_NAME ] && [[ "$file2" ]] && [ "${file2##*/}" == $GEMFILE_LOCK_FILE_NAME ]
  then
    echo "Detected Gemfile and Gemfile.lock files. Installing dependencies using bundle install"
    curl --silent -O $file1
    curl --silent -O $file2
    bundle install --quiet
    echo "Dependencies installed"
    bundle-audit check --format json --output "./"${REPORTS_FOLDER_NAME}"/"$file_name"__"$TIMESTAMP".json"
    echo "Saved report file to ./"${REPORTS_FOLDER_NAME}"/"$file_name"__"$TIMESTAMP".json"
    bundle uninstall --all --quiet
    echo "Dependencies uninstall"
  elif [ "${file1##*/}" == $GEMFILE_FILE_NAME ]
  then
    echo "TBD"
  else
    echo "Error: Could not detect file type or unsupported file type."
  fi
done
