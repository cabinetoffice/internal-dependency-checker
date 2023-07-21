# Node

The Node language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The dependency check tool we are using in this context is npm audit.

One way node potentially differs from other languages is: the possibility of there being a package.json and a package-lock.json. Leading to two possibilities where you either do npm install or npm ci.

Here is a breakdown of what the code does:

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh`

2. It sets up some variables for language name, file names and folder name:

   - `LANG_NAME` is set to `node`.
   - `PACKAGE_FILE_NAME` is set to `package.json`.
   - `PACKAGE_LOCK_FILE_NAME` is set to `package-lock.json`.
   - `REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}"`.

3. It creates the necessary folders to store the reports.

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - The `$REPORTS_FOLDER_NAME` variable is used to specify the folders path.

4. It retrieves the node dependencies from a JSON file named "state.json" using the `set_state_object ()` utility function:

   - `dependencies=$(set_state_object "${LANG_NAME}")`

5. It loops over each dependency retrieved from the previous step.

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

6. Inside the loop, it extracts the "file1", "file2", "file_name" and "repo_file_path" properties the dependency object using `fetch_arguments ()` utility function.

   - `fetch_arguments "STATE" "${dependency}"`

7. It creates a report file name using the `set_file_name ()` utility function:

   - `report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")`

8. It evaluates the conditional expressions:
    - The `if [ "${file1##*/}" == $PACKAGE_FILE_NAME ] && [[ "$file2" ]] && [ "${file2##*/}" == $PACKAGE_LOCK_FILE_NAME ]` expression executes and performs the following:
      - `${file1##*/}` extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `"package.json"` value stored in `$PACKAGE_FILE_NAME` variable
      - `[[ "$file2" ]]` checks if the variable `$file2` is not empty or null
      - `${file2##*/}` extracts the filename from the full path stored in the variable `$file2`, then checks if this filename is equal to the `"package-lock.json"` value stored in `$PACKAGE_LOCK_FILE_NAME` variable

    - The `elif [ "${file1##*/}" == $PACKAGE_FILE_NAME ]` expression extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `"package.json"` value stored in `$PACKAGE_FILE_NAME` variable

9. It changes the current directory to the repository file path where the project is.

   - The `cd "${WORKDIR}/${repo_file_path}" || continue` command changes the directory to the specified repository file path.

10. The condition expression checks whether both `package.json` and `package-lock.json` files are present:
    - If both are present, the `if` check evaluates to true:
      - `npm --silent ci` is run to do a clean install of dependencies
      - `npm audit --json > "${report_file_name}""` is run, which analyses the packages and checks for security vulnerabilities. It then outputs the report to `{report_file_name}`
      - `rm -rf ./node_modules` is run to delete all installed dependencies.

    - If only `package.json` is present, the `elif` check evaluates to true and the `package-lock.json` file is re-generated:

      - `npm install` is run when only `package.json` exists, this is because `npm ci` requires package-lock.json to exist.
      - `npm audit --json > "${report_file_name}""` is run, which analyses the packages and checks for security vulnerabilities. It then outputs the report to `{report_file_name}`
      - `rm -rf ./node_modules` is run to delete all installed dependencies.

11. It prints a message indicating node modules has been deleted and prints the location where the report file is saved.

**Dockerfile** used to build a Docker image for a Node application. Here is a breakdown of what the code does:

1. It sets the base image to `node:14`.
   - The image contains node 14

2. It updates the package repository and jq using the `apt-get` package manager.
   - `apt-get update` updates the package repository.
   - `apt-get install -y jq` installs jq.

3. It sets the working directory to "/idc".
   - `WORKDIR /idc` sets the working directory for subsequent instructions.

4. It copies the contents of the current directory to the Docker image.
   - `COPY . /idc` copies the script file from the current directory to "/idc" in the image.

5. It specifies the command to run when the container starts.
   - `CMD ["./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed, it will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of Node is `14`
