FROM golang:1.16-alpine

# Install GoSec and related dependencies
RUN apk update && \
    apk add --no-cache git jq && \
    go get github.com/securego/gosec/cmd/gosec

RUN git clone https://github.com/sonatype-nexus-community/nancy.git
RUN cd nancy && go get ./... && go build -o /usr/local/bin/nancy .

# Set the working directory to /idc
WORKDIR /idc

# Copy the current directory contents to the container
COPY . /idc

# Start script
CMD ["/bin/sh", "./dep-checker.sh"]
