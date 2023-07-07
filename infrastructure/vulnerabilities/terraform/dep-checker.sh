#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=terraform
REPORTS_FOLDER_NAME=$REPORTS_FOLDER/$LANG_NAME

mkdir -p "${REPORTS_FOLDER_NAME}"

echo "tfsec --version is $(tfsec --version)"

files=$(set_state_object "${LANG_NAME}")

# shellcheck disable=SC2154
# `repo_file_path` assigned on fetch_arguments
for file in $files
do
  fetch_arguments "STATE" "${file}"

  report_file_name=$(set_file_name "${LANG_NAME}")

  echo "Detected terraform file. Checking vulnerabilities using tfsec"
  tfsec --format=json "./${repo_file_path}" > "${report_file_name}"
  echo "Saved report to ${report_file_name}"
done
