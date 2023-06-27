# Node

The Node language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The dependency check tool we are using in this context is npm audit.

One way node potentially differs from other languages is: the possibility of there being a package.json and a package-lock.json. Leading to two possibilities where you either do npm install or npm ci.

Here is a breakdown of what the code does:

1. It sets up some variables for the folder name, the dependency file name, and the working directory.

   - `REPORTS_FOLDER_NAME` is set to "reports/node".
   - `PACKAGE_FILE_NAME` is set to "package.json".
   - `PACKAGE_LOCK_FILE_NAME` is set to "package-lock.json".
   - `WORKDIR` is set to "/repo-dependency-checker".

2. It creates the necessary folders to store the reports.

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - The `REPORTS_FOLDER_NAME` variable is used to specify the folders path.

3. It retrieves the dependencies from a JSON file named "state.json" using `jq` (a command-line JSON processor).

   - The `jq` command extracts the `.node` array from the JSON file.
   - The `.node[]` expression iterates over each element in the array.
   - The `| {file1: .file1, file2: file2, file_name: .file_name, repo_file_path: .repo_file_path}` part selects "file1", "file2" "file_name", and "repo_file_path" properties from each element and creates a new object.
   - The result is stored in the `dependencies` variable.

4. It loops over each dependency retrieved from the previous step.

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

5. Inside the loop, it extracts "file1", "file_name", and "repo_file_path" properties from the dependency object.

   - The `echo "$dependency" | jq -r '.file1'` command extracts the "file1" value.
   - The `echo "$dependency" | jq -r '.file2'` command extracts the "file2" value.
   - The `echo "$dependency" | jq -r '.file_name'` command extracts the "file_name" value.
   - The `echo "$dependency" | jq -r '.repo_file_path'` command extracts the "repo_file_path" value.
   - The values are stored in the `file1`, `file2`, `file_name`, and `repo_file_path` variables, respectively.

6. It generates timestamped file names for the reports.

   - The `date +%Y-%m-%d_%H-%M-%S` command generates a timestamp in the format "YYYY-MM-DD_HH-MM-SS" and stores it in the `TIMESTAMP` variable.
   - The `REPORT_FILE_NAME` variable is constructed by concatenating the working directory (`WORKDIR`), `REPORTS_FOLDER_NAME`, `file_name`, "**node_14**", and `TIMESTAMP`.

7. It prints the extracted values and the timestamp.

   - The `echo` command is used to display the values of `file1`,`file2`, `file_name`, `repo_file_path`, and `TIMESTAMP`.

8. It then validates if both `package.json` and `package-lock.json` exists or if just `package.json` exists without `package-lock.json`.

   - The `if [ "${file1##*/}" == $PACKAGE_FILE_NAME ] && [[ "$file2" ]] && [ "${file2##*/}" == $PACKAGE_LOCK_FILE_NAME ]` validates that `file1` is equal to `package.json` and `file2` is equal to `package-lock.json`
   - The `elif [ "${file1##*/}" == $PACKAGE_FILE_NAME ]` checks if `file1` is equal to `package.json` only if the the first `if check` failed
   - The `else echo {'"error"' : '"'Error: Could not detect file type ${file1}'"'} > $REPORT_FILE_NAME` saves the error message to `$REPORT_FILE_NAME` when `package.json` cannot be found in `file1`, the script will then stop.

9. 

   - The `cd $WORKDIR"/"$repo_file_path` command changes the directory to the specified repository file path.

10a. If both `package.json` and `package-lock.json` exist it then does a clean install of dependencies

   - `npm --silent ci` operates a clean install of dependencies from `package.json` & `package-lock.json`.

10b. If `package.json` exists and `package-lock.json` does not, it does a normal install of dependencies.

   - `npm --silent install` installs all dependencies from package.json.
   - The reason for not using `npm ci` is: `npm ci` requires a package-lock.json file to run.

11. It then scans for vulnerable dependencies using `npm audit`

   - `npm audit --json > $REPORT_FILE_NAME` captures the output from the `npm audit` command into a `json` format.
   - The result is saved to the `REPORT_FILE_NAME` file.

12. It prints a message indicating the location where the report file is saved.

13. It will remove node_modules, deleting all installed dependencies

13b. If `package.json` exists but `package-lock` did not, it also removes `package-lock.json`

**Dockerfile** used to build a Docker image for a Maven application. Here is a breakdown of what the code does:

1. It sets the base image to `node:14`.
   - The image contains node 14

2. It updates the package repository and jq using the `apt-get` package manager.
   - `apt-get update` updates the package repository.
   - `apt-get install -y jq` installs jq.

3. It sets the working directory to "/repo-dependency-checker".
   - `WORKDIR /repo-dependency-checker` sets the working directory for subsequent instructions.

4. It copies the contents of the current directory to the Docker image.
   - `COPY . /repo-dependency-checker` copies the script file from the current directory to "/repo-dependency-checker" in the image.

5. It specifies the command to run when the container starts.
   - `CMD ["./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed, it will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of Node is `14`