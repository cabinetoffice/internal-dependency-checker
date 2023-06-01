FROM alpine:latest

RUN apk update && apk add --no-cache curl jq

RUN curl -L -o /usr/local/bin/tfsec https://github.com/tfsec/tfsec/releases/latest/download/tfsec-linux-amd64
RUN chmod +x /usr/local/bin/tfsec

# Set the working directory to /repo-vulnerability-checker
WORKDIR /repo-vulnerability-checker

# Copy the current directory contents to the container
COPY . /repo-vulnerability-checker

# Start script
CMD ["/bin/sh", "./dep-checker.sh"]
