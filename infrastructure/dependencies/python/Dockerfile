FROM python:3.8-slim-buster

RUN apt-get update && \
    apt-get install -y jq curl

# Set the working directory to /idc
WORKDIR /idc

# Copy the current directory contents to the container
COPY . /idc

# Start script
CMD ["./dep-checker.sh"]
  