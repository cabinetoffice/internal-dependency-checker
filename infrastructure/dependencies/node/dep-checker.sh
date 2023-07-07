#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=node
PACKAGE_FILE_NAME=package.json
PACKAGE_LOCK_FILE_NAME=package-lock.json
REPORTS_FOLDER_NAME="${REPORTS_FOLDER}/${LANG_NAME}"

mkdir -p "${REPORTS_FOLDER_NAME}"

dependencies=$(set_state_object "${LANG_NAME}")

# shellcheck disable=SC2154
# `file1` and `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "STATE" "${dependency}"

  report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")
  
  if [[ "${file1##*/}" == "${PACKAGE_FILE_NAME}" ]] && [[ "$file2" ]] && [[ "${file2##*/}" == "${PACKAGE_LOCK_FILE_NAME}" ]]; then
    echo "Detected Node.js ${PACKAGE_FILE_NAME} and ${PACKAGE_LOCK_FILE_NAME} files. Installing dependencies using npm ci with node 14"
    cd "${WORKDIR}/${repo_file_path}" || continue
    npm --silent ci
    npm audit --json > "${report_file_name}"
    rm -rf ./node_modules
    echo "Removed node_modules/, and saved report to ${report_file_name}"
  elif [[ "${file1##*/}" == "${PACKAGE_FILE_NAME}" ]]; then
    echo "Detected Node.js ${PACKAGE_FILE_NAME} file. Installing dependencies using npm install with node 14"
    cd "${WORKDIR}/${repo_file_path}" || continue
    npm --silent install
    npm audit --json > "${report_file_name}"
    rm -rf ./node_modules
    rm package-lock.json
    echo "Removed ${PACKAGE_LOCK_FILE_NAME} and node_modules/, and saved report to ${report_file_name}"
  else
    print_error "FILE" > "${report_file_name}"
  fi
done
