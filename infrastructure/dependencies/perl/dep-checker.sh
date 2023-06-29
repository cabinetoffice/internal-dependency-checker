#!/bin/bash

REPORTS_FOLDER_NAME=reports/perl
WORKDIR=/repo-dependency-checker

mkdir -p $REPORTS_FOLDER_NAME

# Read the dependencies from the JSON file
dependencies=$(/usr/bin/jq -c '.perl[] | {file_name: .file_name, repo_file_path: .repo_file_path}' ./repos/state.json)

# Loop over the dependencies
for dependency in $dependencies
do
  # Extract the dependency arguments using jq
  file_name=$(echo "$dependency" | jq -r '.file_name')
  repo_file_path=$(echo "$dependency" | jq -r '.repo_file_path')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME=${WORKDIR}"/"${REPORTS_FOLDER_NAME}"/"$file_name"__cpan-audit__"$TIMESTAMP".json"

  # Print arguments
  echo "Contents: $repo_file_path, $file_name and $TIMESTAMP"

  cd $WORKDIR"/"$repo_file_path
  # Install dependencies using cpanm
  cpanm --installdeps .
  # Run cpan-audit to check for vulnerabilities for all installed modules
  cpan-audit installed --json > $REPORT_FILE_NAME

  echo "Saved report file to $REPORT_FILE_NAME"
done
