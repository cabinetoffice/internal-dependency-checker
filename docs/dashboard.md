# Dashboard

- The dashboard folder contains files and configurations for running Git scripts on an alpine image and deploying a Nginx web application on a related image using Docker Compose. The application will run on `localhost:8080`.
- Serves as a centralized and organized folder for deploying the web application, allowing developers to work separately from dependencies and vulnerabilities logic.
- It contains an `app`, `git` folder and a simple compose file, Here's a summary of them:

## APP

- Inside the "app" folder, you'll find the source code and relevant files of the web application, including HTML, CSS, JavaScript, and other necessary assets for the application.
- The dashboard provides monitoring capabilities for GitHub organization, teams, repositories, and members.
- Each section (Teams, Repositories, and Members) on the index page contains links to charts and tables with relevant information.
The sortable table is created in plain JS, while the charts are generated using an external module called [chart.js](https://www.chartjs.org/).

## GIT

- The "git" folder contains three important scripts and files related to Git operations:
  - `dep-checker.sh` (Bash Script): This script iterates through a list of repositories stored in the variable `$repos` and fetches commits per branch, excluding certain branches like "dependabot" and "HEAD."
  - `Dockerfile`: used to build an image containing the necessary environment for the "dep-checker.sh" script to run.
  - `update_git_info.js` (Node Script): performs additional Git-related operations or data processing.
- The script generates a JSON report containing details about each repository's commits, including commit hash, author email, and commit timestamp.
- The JSON reports are saved in the `reports/git/commits` folder.
- If a repository has no commits, an error message indicating that fact is included in the JSON report.
- The node script process the JSON files containing commit information for different repositories. It updates and organizes the data using the REPOS, MEMBERS, and TEAMS objects and writes the final result to a new JSON file `commits_info.json`.

```txt
{
    "REPOS": {
        "repo_name": {
            "members": [
               ...
            ],
            "last": "..."
        }
        ...
    },
    "MEMBERS": {
        "member_name": {
            "count": 0,
            "last": "...",
            "repos": [
               ...
            ]
        }
        ...
    },
    "TEAMS": {
        "team_name": {
            "last": "...",
            "repo": "...",
            "html_url": "..."
        }
        ...
    }
}
```

##  docker-compose.yml

- The "docker-compose.yml" file defines the services and volumes required to run the application using Docker Compose.
- It is a separate compose file from the main one, designed to quickly bootstrap the dashboard, reduce complexity in the main file, and improve maintainability.
- The "app" service has a condition `service_completed_successfully`, which means the Git script (dep-checker.sh) needs to complete successfully before running the "app" service.

## Potential Issues

### Dubious Ownership

- After running `make start-dashboard` due to unknown circumstances (It may potentially be a linux specific issue) it can sometimes output the following error: `fatal: detected dubious ownership in repository at REPO_DIRECTORY`
- This error prevents the `commits_info.json` file from being properly populated with data.
- This can be fixed by editing the git script at: `/infrastructure/dashboard/git/dep-checker.sh`
- Go to line 25 after `git_commits_report_file_name=$(set_file_name "${GIT_REPORTS_FOLDER_NAME}" "git")` and before `if test -n "$(git rev-list -n1 --all)"; then`
- Add the following code to line 25: `git config --global --add safe.directory "${WORKDIR}/${repo_path}"`
- Delete old `commits_info.json` file.
- Run `make start-dashboard` again.