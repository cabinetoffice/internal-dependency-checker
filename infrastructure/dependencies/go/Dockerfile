# Start from a Go image with the desired version
FROM golang:1.16-alpine

# Install GoSec and related dependencies
RUN apk update && \
    apk add --no-cache git jq && \
    go get github.com/securego/gosec/cmd/gosec

# Set the working directory to /repo-dependency-checker
WORKDIR /repo-dependency-checker

# Copy the current directory contents to the container
COPY . /repo-dependency-checker

# Start script
CMD ["/bin/sh", "./dep-checker.sh"]
