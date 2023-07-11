# PHP

The PHP language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The tool used in this context is Composer's `composer audit`, a command that scans the dependencies for reported security vulnerabilities. `composer audit` was introduced in Composer 2.4, and [requires at least PHP 7.2 to be used](https://php.watch/articles/composer-audit). Here is a breakdown of what the code does:

### Bash Script

1. It sources the utility functions from `./utils/script.sh`:

   - `source ./utils/script.sh` 

2. It sets up some variables for language name, file names and folder name:

   - `LANG_NAME` is set to `php`.
   - `COMPOSER_FILE_NAME` is set to `composer.json`.
   - `COMPOSER_LOCK_FILE_NAME` is set to `composer.lock`.
   - `REPORTS_FOLDER_NAME` is set to `"${REPORTS_FOLDER}/${LANG_NAME}"`.

3. It creates the necessary folder to store the reports:

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$REPORTS_FOLDER_NAME` variable is used to specify the folder path.

4. It retrieves the php dependencies from a JSON file named "state.json" using the `set_state_object ()` utility function:

   - `dependencies=$(set_state_object "${LANG_NAME}")`

5. It loops over each dependency retrieved from the previous step.

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

6. Inside the loop, it extracts the "file1", "file2", "file_name" and "repo_file_path" properties the dependency object using `fetch_arguments ()` utility function.

   - `fetch_arguments "STATE" "${dependency}"`

7. It creates a report file name using the `set_file_name ()` utility function:

   - `report_file_name=$(set_file_name "${REPORTS_FOLDER_NAME}" "${LANG_NAME}")`


8. It evaluates the conditional expressions:
    - The `if [ "${file1##*/}" == $COMPOSER_FILE_NAME ] && [[ "$file2" ]] && [ "${file2##*/}" == $COMPOSER_LOCK_FILE_NAME ]` expression executes and performs the following:
      - `${file1##*/}` extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `"composer.json"` value stored in `$COMPOSER_FILE_NAME` variable
      - `[[ "$file2" ]]` checks if the variable `$file2` is not empty or null
      - `${file2##*/}` extracts the filename from the full path stored in the variable `$file2`, then checks if this filename is equal to the `"composer.lock"` value stored in `$COMPOSER_LOCK_FILE_NAME` variable

    - The `elif [ "${file1##*/}" == $COMPOSER_FILE_NAME ]` expression extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `"composer.json"` value stored in `$COMPOSER_FILE_NAME` variable

9. It changes the current directory to the repository file path where the project is.

   - The `cd "${WORKDIR}/${repo_file_path}" || continue` command changes the directory to the specified repository file path.

10. The condition expression checks whether both `composer.json` and `composer.lock` files are present:
    - If both are present, the `if` check evaluates to true:
      - `composer install` is run to install the dependencies
      - `composer audit --format=json > "$REPORT_FILE_NAME"` is run, which analyses the packages and checks for security vulnerabilities based on the information in `composer.lock`.

    - If only `composer.json` is present, the `elif` check evaluates to true and the `composer.lock` file is re-generated:

      - `composer install` is run to re-generate the `composer.lock` file and install the dependencies
      - Then, `composer audit --format=json > "$REPORT_FILE_NAME"` is run, which analyses the installed packages and checks for security vulnerabilities based on the information in the re-generated `composer.lock`.

11. It prints a message indicating the location where the report file is saved. 

### Dockerfile

**Dockerfile** is used to build a Docker image for a PHP application with Composer installed. Here is a breakdown of what the code does:

1. It sets the base image to `php:7.2`:
   - `FROM php:7.2` - The image is based on Debian Linux and contains PHP version 7.2.

2. It updates the package repository and installs `git`, `jq`, `zip` and `unzip` using the `apt` package manager.
   - `apt-get update` updates the package repository.
   - The following command installs the required packages:
   ```
   RUN apt-get update && \
       apt-get install -y jq \
       git \
       zip \
       unzip
   ```

3. It installs Composer using and makes it globally available as a command-line tool:
```
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
```

4. It sets the working directory to "/idc".
   - `WORKDIR /idc` sets the working directory for subsequent instructions.

5. It copies the contents of the current directory to the Docker image.
   - `COPY . /idc` copies the script file from the current directory to "/idc" in the image.

6. It specifies the command to run when the container starts.
   - `CMD ["./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed, including Composer, and will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of PHP is `7.2`
