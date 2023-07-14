# Terraform

The Terraform vulnerability checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The tool used in this context is `tfsec`, a tool that scans for vulnerabilities in terraform code.

### Bash Script

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh` 

2. It sets up some variables for language name, and folder name:

   - `LANG_NAME` is set to `terraform`.
   - `REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}"`.

3. It creates the necessary folder to store the reports:

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$REPORTS_FOLDER_NAME` variable is used to specify the folder path.

4. It prints the current tfsec version:
   - `echo "tfsec --version is $(tfsec --version)"`


5. It retrieves the Terraform files from a JSON file named "state.json" using the `set_state_object ()` utility function:

   - `file=$(set_state_object "${LANG_NAME}")`

6. It loops over the code from every file received in the previous step:

   - The `for file in $files` loop iterates over each item in the `$files` variable.

7. Inside the loop, it extracts the "file1", "file_name" and "repo_file_path" properties the file object using `fetch_arguments ()` utility function:

   - `fetch_arguments "STATE" "${file}"`

8. It creates a report file name using the `set_file_name ()` utility function:

   - `report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")`

9. It performs a vulnerability check using `tfsec` and saves the report 
   - `tfsec --format=json "./${repo_file_path}" > "${report_file_name}"` scans for vulnerabilities and outputs a report to `${report_file_name}`

10. It prints a message indicating the location where the report file is saved.

### Dockerfile

**Dockerfile** is used to build a Docker image for a terraform vulnerability checker. Here is a breakdown of what the code does:

1. It sets the base image to `alpine:latest`:
   - `FROM alpine:latest` - Sets the base image to the latest version of alpine which is a type of lightweight linux distribution

2. It updates the package repository and installs `jq` using the `apk` package manager.
   - `apk update` updates the package repository.
   - `apk add --no-cache curl jq` installs `jq`.

3. It installs Terraform vulnerability checker tfsec
   - `RUN curl -L -o /usr/local/bin/tfsec https://github.com/tfsec/tfsec/releases/latest/download/tfsec-linux-amd64` installs tfsec
   - `RUN chmod +x /usr/local/bin/tfsec` makes the file executable

4. It sets the working directory to "/idc".
   - `WORKDIR /idc` sets the working directory for subsequent instructions.

5. It copies the contents of the current directory to the Docker image.
   - `COPY . /idc` copies the script file from the current directory to "/idc" in the image.

6. It specifies the command to run when the container starts.
   - `CMD ["/bin/sh", "./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed and will execute the "dep-checker.sh" script when a container is started from the image.

