FROM perl:5.36

RUN apt-get update && apt-get install -y jq

RUN cpanm CPAN::Audit

# Set the working directory to /idc
WORKDIR /idc

# Copy the current directory contents to the container
COPY . /idc

# Start script
CMD ["./dep-checker.sh"]
