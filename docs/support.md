# Support folder

- Contains folders that are not related to dependencies or vulnerabilities but provide support and important information like git commits, teams, members and repos.

## GIT

- The "git" folder is related to the search of git commits inside a github organization and contains:
  - `git-commit-info.sh` (Bash Script): This script iterates through a list of repositories stored in the variable `$repos` and fetches commits per branch, excluding certain branches like "dependabot" and "HEAD."
  - `Dockerfile`: used to build an image containing the necessary environment for the "git-commit-info.sh" script to run.
  - `update_git_commits` (Node Script): performs additional operations on the data by removing duplications.
- The script generates a JSON report containing details about each repository's commits, including commit hash, author email, and commit timestamp.
- The script contains the following line of code: `git config --global --add safe.directory "${WORKDIR}/${repo_path}"`. This is to prevent the potenital Dubious Ownership bug. More context around this bug can be found [here](https://stackoverflow.com/a/73100228).
- The JSON reports are saved in the `reports/git/commits` folder. Furthermore git info is also copied in the `reports/git/info` folder to enhance IDC commit data view on Kibana.
- JSON file name will have the following structure `repos__{ORG}__{REPO_FILE_NAME}__git__{TIMESTAMP: yyyy-MM-dd_HH-mm-ss}.json`
- If a repository has no commits, an error message indicating that fact is included in the JSON report.

```txt
{
  "repo_name": [
    {
      "commit": "...",
      "email": "name@mail.com",
      "timestamp": "1654706586"
    },
    {
      "commit": "...",
      "email": "name2@mail.com",
      "timestamp": "1654706501"
    },
    ...
  ]
}
```
