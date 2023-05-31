#!/bin/bash

REPORTS_FOLDER_NAME=reports/gitleaks

mkdir -p $REPORTS_FOLDER_NAME

# # Download and Build Gitleaks
git clone https://github.com/zricethezav/gitleaks.git
cd gitleaks && go build -o /usr/local/bin/gitleaks && cd ..

# Read the repos from the JSON file
repos=$(/usr/bin/jq -c '.repos[]' ./repos.json)

# Loop over the repos
for repo in $repos
do

  # Extract the repo arguments using jq
  repo_path=$(echo "$repo" | jq -r '.repo_path')
  file_name=$(echo "$repo" | jq -r '.file_name')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME="./"${REPORTS_FOLDER_NAME}"/"$file_name"__gitleaks__"$TIMESTAMP".json"

  # Print arguments
  echo "Repo: $repo_path and $REPORT_FILE_NAME"

  echo "Git leaks started for $repo_path"
  gitleaks detect --source ./$repo_path --report-path $REPORT_FILE_NAME
  echo "Saved report file to $REPORT_FILE_NAME"

done
