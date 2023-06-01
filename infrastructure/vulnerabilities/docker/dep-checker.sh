#!/bin/bash

REPORTS_FOLDER_NAME=reports/docker
DOCKERFILE_NAME=Dockerfile
DOCKER_COMPOSE_NAME=docker-compose.yml

mkdir -p $REPORTS_FOLDER_NAME

# Read the repos from the JSON file
repos=$(/usr/bin/jq -c '.repos[]' ./repos.json)

# Loop over the repos
for repo in $repos
do

  # Extract the repo arguments using jq
  file1=$(echo "$repo" | jq -r '.file1')
  directory=$(echo "$repo" | jq -r '.directory')
  file_name=$(echo "$repo" | jq -r '.file_name')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME="./"${REPORTS_FOLDER_NAME}"/"$file_name"__trivy__"$TIMESTAMP".json"

  # Print arguments
  echo "Contents: $file1 $file_name and $TIMESTAMP"

  if [ "${file1##*/}" == $DOCKERFILE_NAME ]
  then
    echo "Detected $DOCKERFILE_NAME file. Checking vulnerabilities using trivy"

    # Faster, secure and high rate of success 
    # docker pull $file1
    # ./trivy image $file1 --format=json --output=$REPORT_FILE_NAME

    # Very slow and with high rate of fails
    # docker build -f $file1 -t myimage_trivy_$TIMESTAMP ./$directory
    # ./trivy image myimage_trivy_$TIMESTAMP --format=json --output=$REPORT_FILE_NAME
    # # ./trivy --file $file1 --format=json --output=$REPORT_FILE_NAME

    echo "Saved report file to $REPORT_FILE_NAME"
  elif [ "${file1##*/}" == $DOCKER_COMPOSE_NAME ]
  then
    echo "Detected $DOCKER_COMPOSE_NAME file. Checking vulnerabilities using trivy"

    # TBD: Already covered on dockerfile checks
    # Once the images are built, we can scan them using Trivy, and retrieves the image names
    # from the Docker Compose file, passes them to Trivy using xargs, and scans each image individually
    # docker-compose images -q | xargs -n 1 ./trivy image --format=json --output=$REPORT_FILE_NAME 
  
    echo "Saved report file to $REPORT_FILE_NAME"
  else
    echo {'"error"' : '"'Error: Could not detect file type ${file1}'"'} > $REPORT_FILE_NAME
  fi
done
