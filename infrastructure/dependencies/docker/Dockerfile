FROM alpine:latest

RUN apk update && \
    apk add --no-cache curl && \
    curl -sSL https://raw.githubusercontent.com/hadolint/hadolint/master/Dockerfile | sh && \
    apk del curl

# Set the working directory to /repo-dependency-checker
WORKDIR /repo-dependency-checker

# Copy the current directory contents to the container
COPY . /repo-dependency-checker

# Start script
CMD ["./dep-checker.sh"]

