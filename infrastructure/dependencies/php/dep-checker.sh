#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=php
COMPOSER_FILE_NAME=composer.json
COMPOSER_LOCK_FILE_NAME=composer.lock
REPORTS_FOLDER_NAME="${REPORTS_FOLDER}/${LANG_NAME}"

mkdir -p "${REPORTS_FOLDER_NAME}"

dependencies=$(set_state_object "${LANG_NAME}")

# shellcheck disable=SC2154
# `file1` and `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "STATE" "${dependency}"

  report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")

  if [[ "${file1##*/}" == "${COMPOSER_FILE_NAME}" ]] && [[ "$file2" ]] && [[ "${file2##*/}" == "${COMPOSER_LOCK_FILE_NAME}" ]]; then
    echo "Detected ${COMPOSER_FILE_NAME} and ${COMPOSER_LOCK_FILE_NAME} files. Immediately auditing dependencies"
    cd "${WORKDIR}/${repo_file_path}" || continue
    composer install
    composer audit --format=json > "${report_file_name}"
    echo "Saved report to ${report_file_name}"
  elif [[ "${file1##*/}" == "${COMPOSER_FILE_NAME}" ]]; then
    echo "Detected ${COMPOSER_FILE_NAME} only. Re-generating ${COMPOSER_LOCK_FILE_NAME} and auditing dependencies"
    cd "${WORKDIR}/${repo_file_path}" || continue
    composer install
    composer audit --format=json > "${report_file_name}"
    echo "Saved report to ${report_file_name}"
  else
    print_error "FILE" > "${report_file_name}"
  fi

done
