#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=kotlin
GRADLEW_FILE_NAME=gradlew
REPORTS_FOLDER_NAME=$REPORTS_FOLDER/$LANG_NAME

mkdir -p "$REPORTS_FOLDER_NAME"

dependencies=$(set_dependencies_object $LANG_NAME)

# shellcheck disable=SC2154
# `file1` and `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "$dependency"
  print_arguments

  report_file_name=$(set_file_name "gradlew")

  if [[ "${file1##*/}" == "$GRADLEW_FILE_NAME" ]]; then
    cd "${WORKDIR}/${repo_file_path}" || continue
    ./gradlew clean build
    ./gradlew dependencyCheckAnalyze > "${report_file_name}" || print_error "BUILD" "$repo_file_path" > "$report_file_name"
    rm -rf .gradle
    echo "Saved report to ${report_file_name}"
  else
    print_error "FILE" > "$report_file_name"
  fi
done
