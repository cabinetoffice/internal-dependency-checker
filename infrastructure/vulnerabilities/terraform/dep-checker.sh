#!/bin/bash

REPORTS_FOLDER_NAME=reports/hcl

mkdir -p $REPORTS_FOLDER_NAME

echo "tfsec --version is $(tfsec --version)"

# Read the repos from the JSON file
repos=$(/usr/bin/jq -c '.repos[]' ./repos.json)

# Loop over the repos
for repo in $repos
do

  # Extract the repo arguments using jq
  repo_file_path=$(echo "$repo" | jq -r '.repo_file_path')
  file_name=$(echo "$repo" | jq -r '.file_name')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME="./"${REPORTS_FOLDER_NAME}"/"$file_name"__tfsec__"$TIMESTAMP".json"

  # Print arguments
  echo "Contents: $repo_file_path $file_name and $TIMESTAMP"

  echo "Detected terraform file. Checking vulnerabilities using tfsec"
  tfsec --format=json ./$repo_file_path > $REPORT_FILE_NAME
  echo "Saved report file to $REPORT_FILE_NAME"

done
