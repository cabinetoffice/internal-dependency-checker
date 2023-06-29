#!/bin/bash

REPORTS_FOLDER_NAME=reports/csharp
CSPROJ_FILE_NAME=*".csproj"
WORKDIR=/repo-dependency-checker

mkdir -p $REPORTS_FOLDER_NAME

# Read the dependencies from the JSON file
dependencies=$(/usr/bin/jq -c '.csharp[] | {file1: .file1, file_name: .file_name, repo_file_path: .repo_file_path}' ./repos/state.json)

# Loop over the dependencies
for dependency in $dependencies
do

  # Extract the dependency arguments using jq
  file1=$(echo "$dependency" | jq -r '.file1')
  file_name=$(echo "$dependency" | jq -r '.file_name')
  repo_file_path=$(echo "$dependency" | jq -r '.repo_file_path')

  # Extract C# project name
  project_name="${file1##*/}"
  project_name="${project_name%.*}"
  echo "$project_name"

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME="${WORKDIR}/${REPORTS_FOLDER_NAME}/${file_name}__dotnet_sdk_6_build__${TIMESTAMP}.json"

  # Print arguments
  echo "Contents: $file1, $repo_file_path, $file_name, and $TIMESTAMP"

  if [[ "${file1##*/}" == $CSPROJ_FILE_NAME ]]; then
    echo "Installing csharp dependencies for $repo_file_path"
    cd "${WORKDIR}/${repo_file_path}"
    dotnet restore
    dotnet build --output .
    dependency-check.sh --scan "${project_name}.dll" --format JSON
    REPORT_FILE_CONTENT=$(cat dependency-check-report.json)
    echo "$REPORT_FILE_CONTENT" > "$REPORT_FILE_NAME"
    echo "Saved report file to $REPORT_FILE_NAME"
  else
    echo '{"error": "Error: Could not detect file type ${file1}"}' > "$REPORT_FILE_NAME"
  fi
done
