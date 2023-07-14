# Gitleaks

The Gitleaks checks logic consists of two separate files: a bash script and a Dockerfile.

The **bash script** performs gitleaks checking by fetching repository file path from the repository list. It then reports the check results to the reports folder. The tool used in this context is `gitleaks detect`, a command that identifies potential sensitive information or secrets leaked in repositories. Here is a breakdown of what the code does:

### Bash Script

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh` 

2. It sets up some variables for language names and folder name:

   - `LANG_NAME` is set to `gitleaks`.
   - `REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}"`.

3. It creates the necessary folder to store the reports:

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$REPORTS_FOLDER_NAME` variable is used to specify the folder path.

4. It downloads and builds Gitleaks:

   - `git clone https://github.com/zricethezav/gitleaks.git`
   - `cd gitleaks && go build -o /usr/local/bin/gitleaks && cd ..`

5. It retrieves the repository file paths from a JSON file named "repos_list.json" using the `set_repos_object ()` utility function:

   - `repos=$(set_repos_object)`

6. It loops over each repository retrieved from the previous step:

   - The `for repo in $repos` loop iterates over each item in the `$repos` variable.

7. Inside the loop, it extracts the "file_name" and "repo_path" properties the dependency object using `fetch_arguments ()` utility function:

   - `fetch_arguments "REPO" "${repo}"`

8. It creates a report file name using the `set_file_name ()` utility function:

   - `report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")`

9. It audits the repository:

   - `gitleaks detect --source "./${repo_path}" --report-path "${report_file_name}"`

10. It prints a message indicating the location where the report file is saved.

### Dockerfile

**Dockerfile** is used to build a Docker image with a Golang runtime, so Gitleaks can run inside a container. Here is a breakdown of what the code does:

1. It sets the base image to `golang:latest`:
   - `FROM golang:latest` - The image is based on Debian Linux and contains the latest official Docker build of Go. 

2. It updates the package repository and installs `jq` using the `apt` package manager.
   - `apt-get update` updates the package repository.
   - `apt-get install -y jq` installs `jq`.

4. It sets the working directory to "/idc".
   - `WORKDIR /idc` sets the working directory for subsequent instructions.

5. It copies the contents of the current directory to the Docker image.
   - `COPY . /idc` copies the script file from the current directory to "/idc" in the image.

6. It specifies the command to run when the container starts.
   - `CMD ["./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed and will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of Go is latest official Docker build
