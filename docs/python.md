# Python

The Python language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The tool used in this context is `pip-audit`, a command that scans the dependencies in `requirements.txt`. Here is a breakdown of what the code does:

### Bash Script

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh` 

2. It sets up some variables for language name, file names and folder name:

   - `LANG_NAME` is set to `python`.
   - `REQUIREMENTS_FILE_NAME` is set to `requirements.txt`.
   - `REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}"`.

3. It creates the necessary folder to store the reports:

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$REPORTS_FOLDER_NAME` variable is used to specify the folder path.

4. It retrieves the Python dependencies from a JSON file named "state.json" using the `set_state_object ()` utility function:

   - `dependencies=$(set_state_object "${LANG_NAME}")`

5. It loops over each dependency retrieved from the previous step:

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

6. Inside the loop, it extracts the "file1", "file2", "file_name" and "repo_file_path" properties the dependency object using `fetch_arguments ()` utility function:

   - `fetch_arguments "STATE" "${dependency}"`

7. It creates a report file name using the `set_file_name ()` utility function:

   - `report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")`


8. The `if [[ "${file1##*/}" == "${REQUIREMENTS_FILE_NAME}" ]]` expression executes and performs the following:
   - `${file1##*/}` extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `"requirements.txt"` value stored in `$REQUIREMENTS_FILE_NAME` variable.

9. It changes the current directory to the repository file path where the project is:

   - The `cd "${WORKDIR}/${repo_file_path}" || continue` command changes the directory to the specified repository file path.

10. It creates a Python virtual environment:
    - `python3 -m venv my_env_"${TIMESTAMP}"`

11. It activates the Python virtual environment in the current directory:
    - `. my_env_"${TIMESTAMP}"/bin/activate`

12. It installs the dependencies listed in `requirements.txt`:
    - `pip3 install -r requirements.txt --quiet --no-cache-dir`

13. It installs pip-audit package:
    - `pip3 install pip-audit`

14. It audits the `requirements.txt` file using `pip-audit` command:
    - `pip-audit -r requirements.txt -f json -o "${report_file_name}"`

15. It prints a message indicating the location where the report file is saved.

### Dockerfile

**Dockerfile** is used to build a Docker image for a Python application. Here is a breakdown of what the code does:

1. It sets the base image to `python:3.8-slim-buster`:
   - `FROM python:3.8-slim-buster` - The image is based on Debian Linux and contains Python version 3.8. 

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

- Version of Python is `3.8`
