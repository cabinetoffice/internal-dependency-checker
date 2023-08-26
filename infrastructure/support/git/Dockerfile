# Base image
FROM alpine:latest

# Install required dependencies
RUN apk update && \
    apk add --no-cache git jq

# Set the working directory to /idc
WORKDIR /idc

# Copy the current directory contents to the container
COPY . /idc

# Start script
CMD ["/bin/sh", "./git-commit-info.sh"]
