# Ruby

The Ruby language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The tool used in this context is `bundle-audit`, a command that scans the dependencies for reported security vulnerabilities. Here is a breakdown of what the code does:

### Bash Script

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh` 

2. It sets up some variables for language name, file names and folder name:

   - `LANG_NAME` is set to `ruby`.
   - `GEMFILE_FILE_NAME` is set to `Gemfile`.
   - `GEMFILE_LOCK_FILE_NAME` is set to `Gemfile.lock`.
   - `REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}"`.

3. It creates the necessary folder to store the reports:

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$REPORTS_FOLDER_NAME` variable is used to specify the folder path.

4. It installs `bundler-audit` gem:

   - `gem install bundler-audit --no-user-install`

5. It retrieves the Ruby dependencies from a JSON file named "state.json" using the `set_state_object ()` utility function:

   - `dependencies=$(set_state_object "${LANG_NAME}")`

6. It loops over each dependency retrieved from the previous step.

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

7. Inside the loop, it extracts the "file1", "file2", "file_name" and "repo_file_path" properties the dependency object using `fetch_arguments ()` utility function.

   - `fetch_arguments "STATE" "${dependency}"`

8. It creates a report file name using the `set_file_name ()` utility function:

   - `report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")`

9. It evaluates the conditional expressions:
    - The `if [[ "${file1##*/}" == "${GEMFILE_FILE_NAME}" ]] && [[ "$file2" ]] && [[ "${file2##*/}" == "${GEMFILE_LOCK_FILE_NAME}" ]]` expression executes and performs the following:
      - `${file1##*/}` extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `Gemfile` value stored in `$GEMFILE_FILE_NAME` variable
      - `[[ "$file2" ]]` checks if the variable `$file2` is not empty or null
      - `${file2##*/}` extracts the filename from the full path stored in the variable `$file2`, then checks if this filename is equal to the `Gemfile.lock` value stored in `$GEMFILE_LOCK_FILE_NAME` variable

    - The `elif [ "${file1##*/}" == $GEMFILE_FILE_NAME ]` expression extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `Gemfile` value stored in `$GEMFILE_FILE_NAME` variable

10. It changes the current directory to the repository file path where the project is.

    - The `cd "${WORKDIR}/${repo_file_path}" || continue` command changes the directory to the specified repository file path.

11. The conditional expression checks whether both `Gemfile` and `Gemfile.lock` files are present:
    - If both are present, the `if` check evaluates to true:
      - `bundle install --quiet` is run to install the dependencies
      - `bundle-audit check --format json --output "${report_file_name}"` is run, which analyses the packages and checks for security vulnerabilities based on the information in `Gemfile.lock`.

    - If only `Gemfile` is present, the `elif` check evaluates to true and the `Gemfile.lock` file is re-generated:

      - `bundle install --quiet` is run to re-generate the `Gemfile.lock` file and install the dependencies
      - Then, `bundle-audit check --format json --output "${report_file_name}"` is run, which analyses the installed packages and checks for security vulnerabilities based on the information in the re-generated `Gemfile.lock`.

12. It prints a message indicating the location where the report file is saved. 

### Dockerfile

**Dockerfile** is used to build a Docker image for a Ruby application. Here is a breakdown of what the code does:

1. It sets the base image to `ruby:latest`:
   - `FROM ruby:latest` - The image is based on Debian Linux and contains the latest official Docker build of Ruby 

2. It updates the package repository and installs `jq` using the `apt` package manager.
   - `apt-get update` updates the package repository.
   - `apt-get install -y jq curl` installs `jq`.

3. It sets the working directory to "/idc".
   - `WORKDIR /idc` sets the working directory for subsequent instructions.

4. It copies the contents of the current directory to the Docker image.
   - `COPY . /idc` copies the script file from the current directory to "/idc" in the image.

5. It specifies the command to run when the container starts.
   - `CMD ["./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed and will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of Ruby is latest official Docker build
