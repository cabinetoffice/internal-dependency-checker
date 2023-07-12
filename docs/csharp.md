# C#

The C# language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The tool used in this context is OWASP Dependency-Check and `dependency-check.sh`, a command that scans the dependencies in the C# assembly binary file `<project_name>.dll`. Here is a breakdown of what the code does:

### Bash Script

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh` 

2. It sets up some variables for language name, file names and folder name:

   - `LANG_NAME` is set to `csharp`.
   - `CSPROJ_FILE_EXTENSION` is set to `csproj`.
   - `REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}"`.

3. It creates the necessary folder to store the reports:

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$REPORTS_FOLDER_NAME` variable is used to specify the folder path.

4. It retrieves the C# dependencies from a JSON file named "state.json" using the `set_state_object ()` utility function:

   - `dependencies=$(set_state_object "${LANG_NAME}")`

5. It loops over each dependency retrieved from the previous step:

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

6. Inside the loop, it extracts the "file1", "file2", "file_name" and "repo_file_path" properties the dependency object using `fetch_arguments ()` utility function:

   - `fetch_arguments "STATE" "${dependency}"`

7. It extracts the C# project name:

   - `PROJECT_NAME=$(basename "${file1}" ".${CSPROJ_FILE_EXTENSION}")`

8. It creates a report file name using the `set_file_name ()` utility function:

   - `report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")`

9. The `if [[ "${file1##*.}" == "${CSPROJ_FILE_EXTENSION}" ]]` expression executes and performs the following:
   - `${file1##*/}` extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `csproj` value stored in `$CSPROJ_FILE_EXTENSION` variable.

10. It changes the current directory to the repository file path where the project is:

    - The `cd "${WORKDIR}/${repo_file_path}" || continue` command changes the directory to the specified repository file path.

11. It restores the dependencies of the project:
    - `dotnet restore`

12. It builds the project and its dependencies into a set of assembly binaries (`.dll`) and outputs these files in the current directory:
    - `dotnet build --output .`

13. It scans the project assembly binary file using the OWASP Dependency-Check shell script:
    - `dependency-check.sh --scan "${PROJECT_NAME}.dll" --format JSON --out "${report_file_name}"`

14. It prints a message indicating the location where the report file is saved.

### Dockerfile

**Dockerfile** is used to build a Docker image for a C# application. Here is a breakdown of what the code does:

1. It sets the base image to `mcr.microsoft.com/dotnet/sdk:6.0`:

   - `FROM mcr.microsoft.com/dotnet/sdk:6.0` - The image is based on Debian Linux and contains .NET Core Runtime 6.0. 

2. It updates the package repository and installs `jq`, `git`, `zip` and `unzip` and `default-jdk` using the `apt` package manager.

   - `apt-get update` updates the package repository.
   - The following command installs the required packages:
   ```
   RUN apt-get update && \
       apt-get install -y jq \
       git \
       zip \
       unzip \
       default-jdk
   ```

3. It sets the OWASP Dependency-Check version to 8.0.0:

   - `ARG DC_VERSION=8.0.0`

4. It downloads and configures OWASP Dependency-Check:
   ```
   RUN curl -LO https://github.com/jeremylong/DependencyCheck/releases/download/v${DC_VERSION}/dependency-check-${DC_VERSION}-release.zip \
    && unzip dependency-check-${DC_VERSION}-release.zip -d /opt/dependency-check \
    && rm dependency-check-${DC_VERSION}-release.zip
    ```

5. It adds OWASP Dependency-Check executable script to the PATH environment variable:

   `ENV PATH="/opt/dependency-check/dependency-check/bin:${PATH}"`

6. It sets the working directory to "/idc".

   - `WORKDIR /idc` sets the working directory for subsequent instructions.

7. It copies the contents of the current directory to the Docker image.

   - `COPY . /idc` copies the script file from the current directory to "/idc" in the image.

8. It sets executable permissions for the "./dep-checker.sh" shell script:

   - `RUN chmod +x dep-checker.sh`

9. It specifies the command to run when the container starts.

   - `CMD ["./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed and will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of .NET Core Runtime is `6.0`
