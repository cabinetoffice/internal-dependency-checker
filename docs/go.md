# Golang

Go lang dependency checks logic consists of two separate files, similar to other languages: a bash script and a dockerfile.

**Bash** script performs dependency checking by fetching detail of (folder path, file name ...) the project from the dependency state file and reporting the check results to the reports folder. Tools used in this context are Nancy and Gosec, the first one focuses on scanning Go dependencies for known vulnerabilities and the second helps identify security flaws, coding mistakes, and vulnerabilities in the go code intself. Here is a breakdown of what the code does:

1. It sets up some variables for folder names and the working directory.

   - `NANCY_REPORTS_FOLDER_NAME` is set to "reports/go/nancy".
   - `GOSEC_REPORTS_FOLDER_NAME` is set to "reports/go/gosec".
   - `WORKDIR` is set to "/repo-dependency-checker".

2. It creates the necessary folders to store the reports.

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$NANCY_REPORTS_FOLDER_NAME` and `$GOSEC_REPORTS_FOLDER_NAME` variables are used to specify the folder paths.

3. It retrieves the dependencies from a JSON file named "state.json" using `jq` (a command-line JSON processor).

   - The `jq` command extracts the `.go` array from the JSON file.
   - The `.go[]` expression iterates over each element in the array.
   - The `| {file_name: .file_name, repo_file_path: .repo_file_path}` part selects the "file_name" and "repo_file_path" properties from each element and creates a new object.
   - The result is stored in the `dependencies` variable.

4. It loops over each dependency retrieved from the previous step.

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

5. Inside the loop, it extracts the "file_name" and "repo_file_path" properties from the dependency object.

   - The `echo "$dependency" | jq -r '.file_name'` command extracts the "file_name" value.
   - The `echo "$dependency" | jq -r '.repo_file_path'` command extracts the "repo_file_path" value.
   - The values are stored in the `file_name` and `repo_file_path` variables, respectively.

6. It generates timestamped file names for the reports.

   - The `date +%Y-%m-%d_%H-%M-%S` command generates a timestamp in the format "YYYY-MM-DD_HH-MM-SS" and stores it in the `TIMESTAMP` variable.
   - The `NANCY_REPORT_FILE_NAME` variable is constructed by concatenating the working directory (`WORKDIR`), `NANCY_REPORTS_FOLDER_NAME`, `file_name`, "**nancy**", and `TIMESTAMP`.
   - The `GOSEC_REPORT_FILE_NAME` variable is constructed similarly using the `GOSEC_REPORTS_FOLDER_NAME` folder.

7. It prints the extracted values and the timestamp.

   - The `echo` command is used to display the values of `file_name`, `repo_file_path`, and `TIMESTAMP`.

8. It changes the current directory to the repository file path where the project is.

   - The `cd $WORKDIR"/"$repo_file_path` command changes the directory to the specified repository file path.

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

5. It sets the working directory to "/repo-dependency-checker".
   - `WORKDIR /repo-dependency-checker` sets the working directory for subsequent instructions.

6. It fetches the dependencies and builds Nancy.
   - `go get ./...` fetches the dependencies for Nancy.
   - `go build -o /usr/local/bin/nancy .` builds the Nancy tool and places the executable in "/usr/local/bin/nancy".

7. It copies the contents of the current directory to the Docker image.
   - `COPY . /repo-dependency-checker` copies the script file from the current directory to "/repo-dependency-checker" in the image.

8. It specifies the command to run when the container starts.
   - `CMD ["/bin/sh", "./dep-checker.sh"]` executes the shell script "./dep-checker.sh" using the "/bin/sh" shell within the container.

The resulting Docker image will have the necessary dependencies installed, including GoSec and Nancy, and will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of Go is `1.16`
