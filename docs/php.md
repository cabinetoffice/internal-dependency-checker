# PHP

The PHP language dependency checks logic consists of two separate files, similar to other languages: a bash script and a Dockerfile.

The **bash script** performs dependency checking by fetching project details (such as folder path and file name) from the dependency state file. It then reports the check results to the reports folder. The tool used in this context is Composer's `composer audit`, a command that scans the dependencies for reported security vulnerabilities. `composer audit` was introduced in Composer 2.4, and [requires at least PHP 7.2 to be used](https://php.watch/articles/composer-audit). Here is a breakdown of what the code does:

### Bash Script

1. It sets up some variables for folder/file names and the working directory.

   - `REPORTS_FOLDER_NAME` is set to "reports/php".
   - `COMPOSER_FILE_NAME` is set to "composer.json".
   - `COMPOSER_LOCK_FILE_NAME` is set to "composer.lock".
   - `WORKDIR` is set to "/repo-dependency-checker".

2. It creates the necessary folder to store the reports.

   - The `mkdir -p` command ensures that the folders are created if they don't already exist.
   - `$REPORTS_FOLDER_NAME` variable is used to specify the folder path.

3. It retrieves the dependencies from a JSON file named "state.json" using `jq` (a command-line JSON processor).

   - The `jq` command extracts the `.php` array from the JSON file.
   - The `.php[]` expression iterates over each element in the array.
   - The `| {file1: .file1, file2: .file2, file_name: .file_name, repo_file_path: .repo_file_path}` part selects the "file1", "file2, "file_name" and "repo_file_path" properties from each element and creates a new object.
   - The result is stored in the `dependencies` variable.

4. It loops over each dependency retrieved from the previous step.

   - The `for dependency in $dependencies` loop iterates over each item in the `$dependencies` variable.

5. Inside the loop, it extracts the "file1", "file2", "file_name" and "repo_file_path" properties from the dependency object.

   - The `echo "$dependency" | jq -r '.file1'` command extracts the "file1" value
   - The `echo "$dependency" | jq -r '.file2'` command extracts the "file2" value.
   - The `echo "$dependency" | jq -r '.file_name'` command extracts the "file_name" value.
   - The `echo "$dependency" | jq -r '.repo_file_path'` command extracts the "repo_file_path" value.
   - The values are stored in the `$file1`, `$file2`, `$file_name` and `$repo_file_path` variables, respectively.

6. It generates timestamped file names for the reports.

   - The `date +%Y-%m-%d_%H-%M-%S` command generates a timestamp in the format "YYYY-MM-DD_HH-MM-SS" and stores it in the `TIMESTAMP` variable.
   - The `REPORT_FILE_NAME` variable is constructed by concatenating the working directory (`WORKDIR`), `REPORTS_FOLDER_NAME`, `file_name`, "**php.7.2**" and `TIMESTAMP`.

7. It prints the extracted values and the timestamp.

   - The `echo` command is used to display the values of `file1`, `file2`, `file_name`, `repo_file_path`, and `TIMESTAMP`.

8a. The `if [ "${file1##*/}" == $COMPOSER_FILE_NAME ] && [[ "$file2" ]] && [ "${file2##*/}" == $COMPOSER_LOCK_FILE_NAME ]` expression executes and performs the following:
- `${file1##*/}` extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `"composer.json"` value stored in `$COMPOSER_FILE_NAME` variable
- `[[ "$file2" ]]` checks if the variable `$file2` is not empty or null
- `${file2##*/}` extracts the filename from the full path stored in the variable `$file2`, then checks if this filename is equal to the `"composer.lock"` value stored in `$COMPOSER_LOCK_FILE_NAME` variable

8b. The `elif [ "${file1##*/}" == $COMPOSER_FILE_NAME ]` expression extracts the filename from the full path stored in the variable `$file1`, then checks if this filename is the equal to the `"composer.json"` value stored in `$COMPOSER_FILE_NAME` variable

9. It changes the current directory to the repository file path where the project is.

   - The `cd $WORKDIR"/"$repo_file_path` command changes the directory to the specified repository file path.

10a. If the 8a. expression evaluates to true, then both `composer.json` and `composer.lock` are present:
   - `composer audit --format=json > "$REPORT_FILE_NAME"` is run, which analyses the packages and checks for security vulnerabilities based on the information in `composer.lock`.

10b. If the 8.b expression evaluates to true, then only the `composer.json` is present. Therefore the `composer.lock` needs to be generated:
   - `composer update` is run and will update the dependencies to their latest versions compatible with PHP 7.2 and generate an updated `composer.lock` file.
   - Then, `composer audit --format=json > "$REPORT_FILE_NAME"` is run, which analyses the installed packages and checks for security vulnerabilities based on the information in the re-generated `composer.lock`.

11. It prints a message indicating the location where the report file is saved. 

### Dockerfile

**Dockerfile** is used to build a Docker image for a PHP application with Composer installed. Here is a breakdown of what the code does:

1. It sets the base image to `php:7.2`.
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

4. It sets the working directory to "/repo-dependency-checker".
   - `WORKDIR /repo-dependency-checker` sets the working directory for subsequent instructions.

5. It copies the contents of the current directory to the Docker image.
   - `COPY . /repo-dependency-checker` copies the script file from the current directory to "/repo-dependency-checker" in the image.

6. It specifies the command to run when the container starts.
   - `CMD ["./dep-checker.sh"]` executes the shell script "./dep-checker.sh" within the container.

The resulting Docker image will have the necessary dependencies installed, including Composer, and will execute the "dep-checker.sh" script when a container is started from the image.

## Assumptions

- Version of PHP is `7.2`
