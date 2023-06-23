#!/bin/bash

NANCY_REPORTS_FOLDER_NAME=reports/go/nancy
GOSEC_REPORTS_FOLDER_NAME=reports/go/gosec
WORKDIR=/repo-dependency-checker

mkdir -p $NANCY_REPORTS_FOLDER_NAME
mkdir -p $GOSEC_REPORTS_FOLDER_NAME

dependencies=$(/usr/bin/jq -c '.go[] | {file_name: .file_name, repo_file_path: .repo_file_path}' ./repos/state.json)

# Loop over the dependencies
for dependency in $dependencies
do
  # Extract the dependency arguments using jq
  file_name=$(echo "$dependency" | jq -r '.file_name')
  repo_file_path=$(echo "$dependency" | jq -r '.repo_file_path')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  NANCY_REPORT_FILE_NAME=${WORKDIR}"/"${NANCY_REPORTS_FOLDER_NAME}"/"$file_name"__nancy__"$TIMESTAMP".json"
  GOSEC_REPORT_FILE_NAME=${WORKDIR}"/"${GOSEC_REPORTS_FOLDER_NAME}"/"$file_name"__gosec__"$TIMESTAMP".json"

  # Print arguments
  echo "Contents: $file_name, $repo_file_path and $TIMESTAMP"

  cd $WORKDIR"/"$repo_file_path
  gosec -fmt=json -out=$GOSEC_REPORT_FILE_NAME ./...
  echo "Saved gosec report file to $GOSEC_REPORT_FILE_NAME"
  go list -json -deps ./... | nancy sleuth --output=json > $NANCY_REPORT_FILE_NAME
  echo "Saved nancy report file to $NANCY_REPORT_FILE_NAME"

done
