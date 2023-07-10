# Use an official Golang runtime as the base image
FROM golang:latest

# Install jq
RUN apt-get update && apt-get install -y jq

# Set the working directory to /idc
WORKDIR /idc

# Copy the current directory contents to the container
COPY . /idc

# Start script
CMD ["./dep-checker.sh"]
