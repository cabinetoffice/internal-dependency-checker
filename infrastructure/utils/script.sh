#!/bin/bash

export REPORTS_FOLDER=reports
export WORKDIR=/repo-dependency-checker

STATE_FILE_PATH=./repos/state.json

set_dependencies_object() {
  # Read the dependencies from the JSON file
  dependencies=$(jq -c '.'"$1"'[] | {
        file1: .file1,
        file2: .file2,
        file_name: .file_name,
        repo_file_path: .repo_file_path
    }' $STATE_FILE_PATH)

  echo "$dependencies"
}

fetch_arguments() {
  # Extract the dependency arguments using jq
  dependency="$1"
  file1=$(echo "${dependency}" | jq -r '.file1')
  file2=$(echo "${dependency}" | jq -r '.file2')
  file_name=$(echo "${dependency}" | jq -r '.file_name')
  repo_file_path=$(echo "${dependency}" | jq -r '.repo_file_path')

  TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
}

set_file_name() {
  file_name="${WORKDIR}/${REPORTS_FOLDER_NAME}/${file_name}__${1}__${TIMESTAMP}.json"
  echo "$file_name"
}

print_arguments() {
  echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
  echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
  echo "Repo file path: ${repo_file_path}"
  echo "File 1: ${file1}"
  echo "File 2: ${file2}"
  echo "File name: ${file_name}"
  echo "Timestamp: ${TIMESTAMP}"
  echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
  echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
}

print_error() {
  if [[ "$1" == "FILE" ]]; then
    echo '{"error" : "Error: Could not detect file type."}'
  elif [[ "$1" == "BUILD" ]]; then
    echo '{"error" : "Error: Could not build project '"${2}"', check file on output folder."}'
  fi
}
