#!/bin/bash

REPORTS_FOLDER_NAME=reports/ruby
GEMFILE_FILE_NAME=Gemfile
GEMFILE_LOCK_FILE_NAME=Gemfile.lock
WORKDIR=/repo-dependency-checker

mkdir -p $REPORTS_FOLDER_NAME

gem install bundler-audit --no-user-install

# Read the dependencies from the JSON file
dependencies=$(/usr/bin/jq -c '.ruby[] | {file1: .file1, file2: .file2, file_name: .file_name, repo_file_path: .repo_file_path}' ./repos/state.json)

# Loop over the dependencies
for dependency in $dependencies
do

  # Extract the dependency arguments using jq
  file1=$(echo "$dependency" | jq -r '.file1')
  file2=$(echo "$dependency" | jq -r '.file2')
  file_name=$(echo "$dependency" | jq -r '.file_name')
  repo_file_path=$(echo "$dependency" | jq -r '.repo_file_path')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME=${WORKDIR}"/"${REPORTS_FOLDER_NAME}"/"$file_name"__bundler-audit__"$TIMESTAMP".json"

  # Print arguments
  echo "Contents: $file1, $file2, $file_name, $repo_file_path and $TIMESTAMP"

  if [ "${file1##*/}" == $GEMFILE_FILE_NAME ] && [[ "$file2" ]] && [ "${file2##*/}" == $GEMFILE_LOCK_FILE_NAME ]
  then
    echo "Detected Gemfile and Gemfile.lock files. Installing dependencies using bundle install"
    cd $WORKDIR"/"$repo_file_path
    bundle install --quiet
    echo "Dependencies installed"
    bundle-audit check --format json --output $REPORT_FILE_NAME
  elif [ "${file1##*/}" == $GEMFILE_FILE_NAME ]
  then
    echo "Detected Gemfile file. Installing dependencies using bundle install"
    cd $WORKDIR"/"$repo_file_path
    bundle install --quiet
    echo "Dependencies installed"
    bundle-audit check --format json --output $REPORT_FILE_NAME    
  else
    echo {'"error"' : '"'Error: Could not detect files type ${file1} and ${file2}'"'} > $REPORT_FILE_NAME
  fi
  echo "Saved report file to $REPORT_FILE_NAME"
done
