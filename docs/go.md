# Golang

The Go language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The tools used in this context are Nancy and Gosec. Nancy focuses on scanning Go dependencies for known vulnerabilities, while Gosec helps identify security flaws, coding mistakes, and vulnerabilities in the Go code itself. Here is a breakdown of what the code does:

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh` 

2. It sets up some variables for language name, file names and folder names:

   - `LANG_NAME` is set to `go`.
   - `NANCY_NAME` is set to `nancy`.
   - `GOSEC_NAME` is set to `gosec`.
   - `NANCY_REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}/${NANCY_NAME}"`.
   - `GOSEC_REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}/${GOSEC}"`.

3. It creates the necessary folders to store the reports.

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$NANCY_REPORTS_FOLDER_NAME` and `$GOSEC_REPORTS_FOLDER_NAME` variables are used to specify the folder paths.

4. It retrieves the go dependencies from a JSON file named "state.json" using the `set_state_object ()` utility function:

   - `dependencies=$(set_state_object "${LANG_NAME}")`

5. It loops over each dependency retrieved from the previous step.

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

6. Inside the loop, it extracts the "file_name" and "repo_file_path" properties from the dependency object using `fetch_arguments ()` utility function.

   - `fetch_arguments "STATE" "${dependency}"`

7. It creates two report file names using the `set_file_name ()` utility function:

   - `nancy_report_file_name=$(set_file_name "${NANCY_REPORTS_FOLDER_NAME}" "${NANCY_NAME}")`
   - `gosec_report_file_name=$(set_file_name "${GOSEC_REPORTS_FOLDER_NAME}" "${GOSEC_NAME}")`

8. It changes the current directory to the repository file path where the project is.

   - The `cd "${WORKDIR}/${repo_file_path}" || continue` command changes the directory to the specified repository file path.

9. It runs the `gosec` command to perform security analysis on the Go code.

   - The `gosec -fmt=json -out=$GOSEC_REPORT_FILE_NAME ./...` command executes the `gosec` tool with the options `-fmt=json` (output format as JSON) and `-out=$GOSEC_REPORT_FILE_NAME` (output file name).
   - `./...` represents all Go packages in the current directory and its subdirectories.

10. It prints a message indicating the location where the Gosec report file is saved.

11. It runs the `nancy` command to perform vulnerability analysis on the Go code:

    - `go list -json -deps ./... | nancy sleuth --output=json > $NANCY_REPORT_FILE_NAME` executes the `go list` command to get the Go package dependencies in JSON format.
    - The output of `go list` is piped (`|`) to the `nancy sleuth --output=json` command to perform vulnerability analysis using Nancy.
    - The result is saved to the `NANCY_REPORT_FILE_NAME` file.

**Dockerfile** used to build a Docker image for a Go application with GoSec and Nancy tools installed. Here is a breakdown of what the code does:

1. It sets the base image to `golang:1.16-alpine`.
   - The image is based on Alpine Linux and contains Go version 1.16.

2. It updates the package repository and installs Git and jq using the `apk` package manager.
   - `apk update` updates the package repository.
   - `apk add --no-cache git jq` installs Git and jq without caching the downloaded package files.

3. It installs GoSec using the `go get` command.
   - `go get github.com/securego/gosec/cmd/gosec` fetches the GoSec tool and its dependencies.

4. It clones the Nancy repository from GitHub.
   - `git clone https://github.com/sonatype-nexus-community/nancy.git` clones the Nancy repository.

5. It fetches the dependencies and builds Nancy.
   - `go get ./...` fetches the dependencies for Nancy.
   - `go build -o /usr/local/bin/nancy .` builds the Nancy tool and places the executable in "/usr/local/bin/nancy".

6. It sets the working directory to "/idc".
   - `WORKDIR /idc` sets the working directory for subsequent instructions.

7. It copies the contents of the current directory to the Docker image.
   - `COPY . /idc` copies the script file from the current directory to "/repo-dependency-checker" in the image.

8. It specifies the command to run when the container starts.
   - `CMD ["/bin/sh", "./dep-checker.sh"]` executes the shell script "./dep-checker.sh" using the "/bin/sh" shell within the container.

The resulting Docker image will have the necessary dependencies installed, including GoSec and Nancy, and will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of Go is `1.16`
