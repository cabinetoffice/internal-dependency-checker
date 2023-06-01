# Use an official Golang runtime as the base image
FROM golang:latest

# Install jq
RUN apt-get update && apt-get install -y jq

# Set the working directory to /repo-vulnerability-checker
WORKDIR /repo-vulnerability-checker

# Copy the current directory contents to the container
COPY . /repo-vulnerability-checker

# Start script
CMD ["./dep-checker.sh"]
