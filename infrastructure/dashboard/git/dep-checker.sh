#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

COMMITS_FILE_NAME=commits_info.json
GIT_COMMITS_FOLDER_NAME=git/commits
GIT_REPORTS_FOLDER_NAME="${REPORTS_FOLDER}/${GIT_COMMITS_FOLDER_NAME}"

mkdir -p "${GIT_REPORTS_FOLDER_NAME}"

repos=$(set_repos_object)

# shellcheck disable=SC2154
# `repo_path` assigned on fetch_arguments
for repo in $repos
do
  fetch_arguments "REPO" "${repo}"

  cd "${WORKDIR}/${repo_path}" || continue

  repo_folder=${repo_path##*/}
  git_commits_report_file_name=$(set_file_name "${GIT_REPORTS_FOLDER_NAME}" "git")
  git config --global --add safe.directory "${WORKDIR}/${repo_path}"

  if test -n "$(git rev-list -n1 --all)"; then
    {
      echo '{"'"${repo_folder}"'": ['
      for branch in $(git branch -r | awk '{print $1}' | grep -vE "origin/(dependabot|HEAD)"); do git log --first-parent --pretty=format:'{%n  "commit": "%H",%n  "email": "%aE",%n  "timestamp": "%at"%n},' "$branch"; done | sed '$ s/,$//'
      echo ']}'
    } > "${git_commits_report_file_name}"
  else
    echo '{"'"${repo_folder}"'": [{"error" : "your current branch does not have any commits yet" }]}' > "${git_commits_report_file_name}"
  fi
done

node "${WORKDIR}/update_git_info.js" "${WORKDIR}/${GIT_REPORTS_FOLDER_NAME}" "${WORKDIR}/${REPOS_FOLDER}/${COMMITS_FILE_NAME}" "${WORKDIR}/${REPOS_FOLDER}/${TEAMS_FILE_NAME}"
