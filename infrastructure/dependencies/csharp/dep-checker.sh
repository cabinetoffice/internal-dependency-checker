#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=csharp
REPORTS_FOLDER_NAME=reports/csharp
CSPROJ_FILE_EXTENSION="csproj"

mkdir -p $REPORTS_FOLDER_NAME

dependencies=$(set_dependencies_object $LANG_NAME)

# shellcheck disable=SC2154
# `file1` and `repo_file_path` assigned on fetch_arguments
for dependency in $dependencies
do
  fetch_arguments "$dependency"
  print_arguments

  # Extract C# project name
  PROJECT_NAME=$(basename "$file1" "."$CSPROJ_FILE_EXTENSION)
  echo "$PROJECT_NAME"

  report_file_name=$(set_file_name "dotnet_sdk_6_build")

  if [[ "${file1##*.}" == "$CSPROJ_FILE_EXTENSION" ]]; then
    echo "Installing csharp dependencies. Checking dependencies using dependency-check.sh"
    cd "${WORKDIR}/${repo_file_path}" || continue
    dotnet restore
    dotnet build --output .
    dependency-check.sh --scan "${PROJECT_NAME}.dll" --format JSON
    mv dependency-check-report.json "$report_file_name"
    echo "Saved report to ${report_file_name}"
  else
    print_error "FILE" > "$report_file_name"
  fi
done
