# Perl

The Perl language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details, (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The tool used in this context is `cpan-audit`, a command that scans the metadata of Perl modules. Here is a breakdown of what the code does:

### Bash Script

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh` 

2. It sets up some variables for language names and folder name:

   - `LANG_NAME` is set to `perl`.
   - `REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}"`.

3. It creates the necessary folder to store the reports:

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$REPORTS_FOLDER_NAME` variable is used to specify the folder path.

4. It retrieves the Perl dependencies from a JSON file named "state.json" using the `set_state_object ()` utility function:

   - `dependencies=$(set_state_object "${LANG_NAME}")`

5. It loops over each dependency retrieved from the previous step:

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

6. Inside the loop, it extracts the "file1", "file2", "file_name" and "repo_file_path" properties the dependency object using `fetch_arguments ()` utility function:

   - `fetch_arguments "STATE" "${dependency}"`

7. It creates a report file name using the `set_file_name ()` utility function:

   - `report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")`

8. It changes the current directory to the repository file path where the project is:

   - The `cd "${WORKDIR}/${repo_file_path}" || continue` command changes the directory to the specified repository file path.

9. It installs the Perl dependencies in the current directory:
   - `cpanm --installdeps .`

10. It audits the installed Perl dependencies:
    - `cpan-audit installed --json > "${report_file_name}"`

11. It prints a message indicating the location where the report file is saved.

### Dockerfile

**Dockerfile** is used to build a Docker image for a Perl application. Here is a breakdown of what the code does:

1. It sets the base image to `perl:5.36`:
   - `FROM perl:5.36` - The image is based on Debian Linux and contains Perl version 5.36. 

2. It updates the package repository and installs `jq` using the `apt` package manager.
   - `apt-get update` updates the package repository.
   - `apt-get install -y jq` installs `jq`.

3. It executes `cpanm` to install the `CPAN::Audit` module:
   - `RUN cpanm CPAN::Audit`

4. It sets the working directory to "/idc".
   - `WORKDIR /idc` sets the working directory for subsequent instructions.

5. It copies the contents of the current directory to the Docker image.
   - `COPY . /idc` copies the script file from the current directory to "/idc" in the image.

6. It specifies the command to run when the container starts.
   - `CMD ["./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed and will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of Perl is `5.36`
