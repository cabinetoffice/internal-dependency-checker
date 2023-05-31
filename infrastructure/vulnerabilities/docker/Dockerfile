# Base image
FROM alpine:latest

# Install required dependencies
RUN apk update && \
    apk add --no-cache ca-certificates git docker jq

# Clone Trivy repository
RUN git clone --depth 1 https://github.com/aquasecurity/trivy.git /repo-vulnerability-checker

# Set the working directory to /repo-vulnerability-checker
WORKDIR /repo-vulnerability-checker

# Install Trivy
RUN apk add --no-cache go && \
    go mod download && \
    go build -o trivy cmd/trivy/main.go

# Copy the current directory contents to the container
COPY . /repo-vulnerability-checker

# Start script
CMD ["/bin/sh", "./dep-checker.sh"]
