FROM python:3.8-slim-buster

RUN apt-get update && \
    apt-get install -y jq curl

# Set the working directory to /repo-dependency-checker
WORKDIR /repo-dependency-checker

# Copy the current directory contents to the container
COPY . /repo-dependency-checker

# Start script
CMD ["./dep-checker.sh"]
  