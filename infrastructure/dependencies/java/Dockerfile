# Use a base image with Java and Maven pre-installed
FROM maven:3.8.4-openjdk-17-slim

RUN apt-get update && apt-get install -y jq

# Set the working directory to /repo-dependency-checker
WORKDIR /repo-dependency-checker

# Copy the current directory contents to the container
COPY . /repo-dependency-checker

# Start script
CMD ["./dep-checker.sh"]
