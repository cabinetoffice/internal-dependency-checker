#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=perl
REPORTS_FOLDER_NAME="${REPORTS_FOLDER}/${LANG_NAME}"

mkdir -p "${REPORTS_FOLDER_NAME}"

dependencies=$(set_state_object "${LANG_NAME}")

# shellcheck disable=SC2154
# `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "STATE" "${dependency}"

  report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")

  cd "${WORKDIR}/${repo_file_path}" || continue
  cpanm --installdeps .
  cpan-audit installed --json > "${report_file_name}"
  echo "Saved report to ${report_file_name}"
done
