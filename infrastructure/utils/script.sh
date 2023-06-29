#!/bin/bash

REPORTS_FOLDER=reports
WORKDIR=/repo-dependency-checker

set_dependencies_object ()
{
    # Read the dependencies from the JSON file
    dependencies=$(/usr/bin/jq -c '.'$1'[] | {file1: .file1, file2: .file2, file_name: .file_name, repo_file_path: .repo_file_path}' ./repos/state.json)
}

fetch_arguments ()
{
  # Extract the dependency arguments using jq
  file1=$(echo "$dependency" | jq -r '.file1')
  file2=$(echo "$dependency" | jq -r '.file2')
  file_name=$(echo "$dependency" | jq -r '.file_name')
  repo_file_path=$(echo "$dependency" | jq -r '.repo_file_path')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
}

set_file_name ()
{
  REPORT_FILE_NAME=${WORKDIR}"/"${REPORTS_FOLDER_NAME}"/"$file_name"__"$1"__"$TIMESTAMP".json"
}

print_arguments ()
{
    echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    echo "File 1: $file1"
    echo "File 2: $file2"
    echo "Repo file path: $repo_file_path"
    echo "File name: $file_name"
    echo "Timestamp: $TIMESTAMP"
    echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
}

print_error ()
{
    echo {'"error"' : '"'Error: Could not detect file type ${file1}'"'} > $REPORT_FILE_NAME
}

debug_script ()
{
    while true
    do
        echo "Sleeping 10 sec"
        sleep 10
    done
}