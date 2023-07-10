#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=ruby
GEMFILE_FILE_NAME=Gemfile
GEMFILE_LOCK_FILE_NAME=Gemfile.lock
REPORTS_FOLDER_NAME="${REPORTS_FOLDER}/${LANG_NAME}"

mkdir -p "${REPORTS_FOLDER_NAME}"

gem install bundler-audit --no-user-install

dependencies=$(set_state_object "${LANG_NAME}")

# shellcheck disable=SC2154
# `file1` and `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "STATE" "${dependency}"

  report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")

  if [[ "${file1##*/}" == "${GEMFILE_FILE_NAME}" ]] && [[ "$file2" ]] && [[ "${file2##*/}" == "${GEMFILE_LOCK_FILE_NAME}" ]]; then
    echo "Detected ${GEMFILE_FILE_NAME} and ${GEMFILE_LOCK_FILE_NAME} files. Installing dependencies using bundle install"
    cd "${WORKDIR}/${repo_file_path}" || continue
    bundle install --quiet
    bundle-audit check --format json --output "${report_file_name}"
    echo "Saved report to ${report_file_name}"
  elif [[ "${file1##*/}" == "${GEMFILE_FILE_NAME}" ]]; then
    echo "Detected ${GEMFILE_FILE_NAME} file. Installing dependencies using bundle install"
    cd "${WORKDIR}/${repo_file_path}" || continue
    bundle install --quiet
    bundle-audit check --format json --output "${report_file_name}"
    echo "Saved report to ${report_file_name}"
  else
    print_error "FILE" > "${report_file_name}"
  fi
done
