#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=go
NANCY_REPORTS_FOLDER_NAME=reports/go/nancy
GOSEC_REPORTS_FOLDER_NAME=reports/go/gosec

mkdir -p $NANCY_REPORTS_FOLDER_NAME
mkdir -p $GOSEC_REPORTS_FOLDER_NAME

dependencies=$(set_dependencies_object $LANG_NAME)

# shellcheck disable=SC2154
# `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "$dependency"
  print_arguments

  nancy_report_file_name=$(set_file_name "nancy")
  gosec_report_file_name=$(set_file_name "gosec")

  cd "${WORKDIR}/${repo_file_path}" || continue
  gosec -fmt=json -out="$gosec_report_file_name" ./...
  echo "Saved gosec report to ${gosec_report_file_name}"
  go list -json -deps ./... | nancy sleuth --output=json > "$nancy_report_file_name"
  echo "Saved nancy report to ${nancy_report_file_name}"
done
