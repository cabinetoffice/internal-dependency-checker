# Java

The Java language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The tool used in this context is the OWASP Dependency Check Tool which scans the dependencies of the project and identifies known vulnerabilities.

Here is a breakdown of what the code does:

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh` 

2. It sets up some variables for language name, file name and folder name:
   - `LANG_NAME` is set to `java`
   - `POM_FILE_NAME` is set to `pom.xml`
   - `REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}`

3. It creates the necessary folders to store the reports.

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - The `$REPORTS_FOLDER_NAME` variable is used to specify the folders path.

4. It retrieves the java dependencies from a JSON file named "state.json" using the `set_state_object ()` utility function:

   - `dependencies=$(set_state_object "${LANG_NAME}")`

5. It loops over each dependency retrieved from the previous step.

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

6. Inside the loop, it extracts the "file1", "file_name" and "repo_file_path" properties the dependency object using `fetch_arguments ()` utility function.

   - `fetch_arguments "STATE" "${dependency}"`

7. It creates a report file name using the `set_file_name ()` utility function:

   - `report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")`

8. It then validates that `pom.xml` exists.

   - The `if [ "${file1##*/}" == $POM_FILE_NAME ]` validates whether `file1` is equal to `pom.xml`
   - The `else echo {'"error"' : '"'Error: Could not detect file type ${file1}'"'} > $REPORT_FILE_NAME` saves the error message to `$REPORT_FILE_NAME` when `pom.xml` cannot be found in `file1`, the script will then stop.

9. It changes the current directory to the repository file path where the project is.

   - The `cd "${WORKDIR}/${repo_file_path}" || continue` command changes the directory to the specified repository file path.

10. It downloads and runs the OWASP Dependency Check Tool.

   - The `mvn clean install` does a clean install of mvn dependencies including the OWASP Dependency Check Tool.
   - The `dependency-check.sh --scan "target/**/*.jar" --format "JSON" --out "${report_file_name}"` scans for vulnerabilities and outputs a report to `${report_file_name}`in format `json`.
   
11. It prints a message indicating the location where the report file is saved. 

**Dockerfile** used to build a Docker image for a Maven application. Here is a breakdown of what the code does:

1. It sets the base image to `maven:3.8.4-openjdk-17-slim`.
   - The image contains maven 3.8.4 and is a lighter version of a maven docker image

2. It updates the package repository and jq using the `apt-get` package manager.
   - `apt-get update` updates the package repository.
   - `apt-get install -y jq` installs jq.
   - `unzip\zip` initializes unzip and zip for later use

3. It downloads and configures OWASP Dependency Check.

   - `ARG DC_VERSION=8.0.0 ` defines version of OWASP Dependency Check
   - `RUN curl -LO https://github.com/jeremylong/DependencyCheck/releases/download/v${DC_VERSION}/dependency-check-${DC_VERSION}-release.zip` downloads specified version of OWASP Dependency Check
   - `unzip dependency-check-${DC_VERSION}-release.zip -d /opt/dependency-check` unzips OWASP Dependency Check to `/opt/dependency-check`.
   - `rm dependency-check-${DC_VERSION}-release.zip` deletes the original downloaded OWASP Dependency Check Zip folder.
   - `ENV PATH="/opt/dependency-check/dependency-check/bin:${PATH}"` Adds OWASP Dependency Check to `${PATH}`

4. It sets the working directory to "/idc".
   - `WORKDIR /idc` sets the working directory for subsequent instructions.

5. It copies the contents of the current directory to the Docker image.
   - `COPY . /idc` copies the script file from the current directory to "/idc" in the image.

6. It specifies the command to run when the container starts.
   - `CMD ["./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed, it will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of Maven is `3.8.4`

