#!/bin/bash

REPORTS_FOLDER_NAME=reports
POM_FILE_NAME=pom.xml

mkdir -p $REPORTS_FOLDER_NAME

# Read the dependencies from the JSON file
dependencies=$(/usr/bin/jq -c '.dependencies[]' ./dependencies.json)

# Loop over the dependencies
for dependency in $dependencies
do
  # Extract the dependency arguments using jq
  file1=$(echo "$dependency" | jq -r '.file1')
  file_name=$(echo "$dependency" | jq -r '.file_name')

  TIMESTAMP=`date +%Y-%m-%d_%H-%M-%S`
  REPORT_FILE_NAME="../"${REPORTS_FOLDER_NAME}"/"$file_name"__pom_xml__"$TIMESTAMP".json"

  # Print arguments
  echo "Contents: $file1, $file_name and $TIMESTAMP"
  
  if [ "${file1##*/}" == $POM_FILE_NAME ]
  then
    mkdir $TIMESTAMP && cd "$_" 
    echo "Detected pom.xml file. Checking dependencies using dependency-check:check"
    curl --silent -O $file1
    # The dependency-check:check goal is provided by the OWASP Dependency Check tool,  which can be executed
    # as a standalone application or integrated with Maven. When running the mvn dependency-check:check command,
    # Maven automatically downloads and executes the OWASP Dependency Check tool to analyze the project's dependencies.
    mvn dependency-check:check -Dformat=json
    mv ./target/dependency-check-report.json $REPORT_FILE_NAME
    echo "Saved report file to $REPORT_FILE_NAME"
    cd ..
  else
    echo {'"error"' : '"'Error: Could not detect file type ${file1}'"'} > $REPORT_FILE_NAME
  fi
done
