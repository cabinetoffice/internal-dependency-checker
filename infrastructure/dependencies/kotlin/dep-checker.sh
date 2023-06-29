#!/bin/bash

. ./utils/script.sh --source-only

LANG_NAME=kotlin
GRADLEW_FILE_NAME=gradlew
REPORTS_FOLDER_NAME=$REPORTS_FOLDER/$LANG_NAME

mkdir -p $REPORTS_FOLDER_NAME

set_dependencies_object $LANG_NAME

for dependency in $dependencies
do
  fetch_arguments
  set_file_name "gradlew"
  if [ "${file1##*/}" == $GRADLEW_FILE_NAME ]
  then
    print_arguments
    cd $WORKDIR"/"$repo_file_path
    ./gradlew clean build || echo {'"error"' : '"'Error: Could not build project ${repo_file_path}, check file on output folder.'"'} > $REPORT_FILE_NAME && continue
    ./gradlew dependencyCheckAnalyze > $REPORT_FILE_NAME
    rm -rf .gradle
    echo "Saved report file to $REPORT_FILE_NAME"
  else
    print_error
  fi
done
