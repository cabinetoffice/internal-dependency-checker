#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=perl
REPORTS_FOLDER_NAME=reports/perl

mkdir -p $REPORTS_FOLDER_NAME

dependencies=$(set_dependencies_object $LANG_NAME)

# shellcheck disable=SC2154
# `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "$dependency"
  print_arguments

  report_file_name=$(set_file_name "cpan_audit")

  cd "${WORKDIR}/${repo_file_path}" || continue
  cpanm --installdeps .
  cpan-audit installed --json > "$report_file_name"
  echo "Saved report to ${report_file_name}"
done
