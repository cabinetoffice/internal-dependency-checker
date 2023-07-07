#!/bin/bash

# Directory path in the running container. Check volumes on compose file.
# shellcheck disable=SC1091
source ./utils/script.sh

LANG_NAME=docker
DOCKERFILE_NAME=Dockerfile
DOCKER_COMPOSE_NAME=docker-compose.yml
REPORTS_FOLDER_NAME=$REPORTS_FOLDER/$LANG_NAME

mkdir -p "$REPORTS_FOLDER_NAME"

files=$(set_dependencies_object "${LANG_NAME}")

# shellcheck disable=SC2154
# `file1` and `repo_file_path` assigned on fetch_arguments
for file in $files
do
  fetch_arguments "STATE" "${file}"

  report_file_name=$(set_file_name "${LANG_NAME}")

  if [[ "${file1##*/}" == "$DOCKERFILE_NAME" ]]; then
    echo "Detected ${DOCKERFILE_NAME} file. Checking vulnerabilities using trivy"

    # Faster, secure and high rate of success 
    # docker pull $file1
    # ./trivy image $file1 --format=json --output=$REPORT_FILE_NAME

    # Very slow and with high rate of fails
    # docker build -f $file1 -t myimage_trivy_$TIMESTAMP ./$repo_file_path
    # ./trivy image myimage_trivy_$TIMESTAMP --format=json --output=$REPORT_FILE_NAME
    # # ./trivy --file $file1 --format=json --output=$REPORT_FILE_NAME

    echo "Saved report to ${report_file_name}"
  elif [[ "${file1##*/}" == "${DOCKER_COMPOSE_NAME}" ]]; then
    echo "Detected ${DOCKER_COMPOSE_NAME file}. Checking vulnerabilities using trivy"

    # TBD: Already covered on dockerfile checks
    # Once the images are built, we can scan them using Trivy, and retrieves the image names
    # from the Docker Compose file, passes them to Trivy using xargs, and scans each image individually
    # docker-compose images -q | xargs -n 1 ./trivy image --format=json --output=$REPORT_FILE_NAME 
  
    echo "Saved report to ${report_file_name}"
  else
    print_error "FILE" > "${report_file_name}"
  fi
done
