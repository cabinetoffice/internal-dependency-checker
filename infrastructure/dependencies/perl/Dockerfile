FROM perl:5.36

RUN apt-get update && apt-get install -y jq

RUN cpanm CPAN::Audit

# Set the working directory to /repo-dependency-checker
WORKDIR /repo-dependency-checker

# Copy the current directory contents to the container
COPY . /repo-dependency-checker

# Start script
CMD ["./dep-checker.sh"]
