#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=gitleaks
REPORTS_FOLDER_NAME="${REPORTS_FOLDER}/${LANG_NAME}"

mkdir -p "${REPORTS_FOLDER_NAME}"

# Download and Build Gitleaks
git clone https://github.com/zricethezav/gitleaks.git
cd gitleaks && go build -o /usr/local/bin/gitleaks && cd ..

repos=$(set_repos_object)

# shellcheck disable=SC2154
# `repo_path` assigned on fetch_arguments
for repo in $repos
do
  fetch_arguments "REPO" "${repo}"  

  report_file_name=$(set_file_name $LANG_NAME)

  echo "Git leaks started for ${repo_path}"
  gitleaks detect --source "./${repo_path}" --report-path "${report_file_name}"
  echo "Saved report to ${report_file_name}"
done
