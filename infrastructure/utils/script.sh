#!/bin/bash

export REPORTS_FOLDER=reports
export WORKDIR=/idc

STATE_FILE_PATH=./repos/state.json
REPO_FILE_PATH=./repos/repos_list.json

set_dependencies_object() {
  dependencies=$(jq -c '.'"$1"'[] | {
        file1: .file1,
        file2: .file2,
        file_name: .file_name,
        repo_file_path: .repo_file_path
    }' "${STATE_FILE_PATH}")

  echo "${dependencies}"
}

set_repos_object() {
  repos=$(jq -c '.repos[] | {
        repo_path: .repo_path,
        file_name: .file_name
    }' "${REPO_FILE_PATH}")

  echo "${repos}"
}

fetch_arguments() {
  data="$2"

  TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
  file_name=$(echo "${data}" | jq -r '.file_name')

  if [[ "$1" == "STATE" ]]; then
    file1=$(echo "${data}" | jq -r '.file1')
    file2=$(echo "${data}" | jq -r '.file2')
    repo_file_path=$(echo "${data}" | jq -r '.repo_file_path')
  elif [[ "$1" == "REPO" ]]; then
    repo_path=$(echo "${data}" | jq -r '.repo_path')
  fi

  print_arguments "$1"
}

set_file_name() {
  file_name="${WORKDIR}/${REPORTS_FOLDER_NAME}/${file_name}__${1}__${TIMESTAMP}.json"
  echo "$file_name"
}

print_arguments() {
  echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
  if [[ "$1" == "STATE" ]]; then
      echo "Repo file path: ${repo_file_path}"
      echo "File 1: ${file1}"
      echo "File 2: ${file2}"
  elif [[ "$1" == "REPO" ]]; then
      echo "Repo path: ${repo_path}"
  fi
  echo "File name: ${file_name}"
  echo "Timestamp: ${TIMESTAMP}"
  echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
}

print_error() {
  if [[ "$1" == "FILE" ]]; then
    echo '{"error" : "Error: Could not detect file type."}'
  elif [[ "$1" == "BUILD" ]]; then
    echo '{"error" : "Error: Could not build project '"${2}"', check file on output folder."}'
  fi
}
