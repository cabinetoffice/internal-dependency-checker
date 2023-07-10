# Base image
FROM alpine:latest

# Install required dependencies
RUN apk update && \
    apk add --no-cache ca-certificates git docker jq

# Clone Trivy repository
RUN git clone --depth 1 https://github.com/aquasecurity/trivy.git /idc

# Set the working directory to /idc
WORKDIR /idc

# Install Trivy
RUN apk add --no-cache go && \
    go mod download && \
    go build -o trivy cmd/trivy/main.go

# Copy the current directory contents to the container
COPY . /idc

# Start script
CMD ["/bin/sh", "./dep-checker.sh"]
