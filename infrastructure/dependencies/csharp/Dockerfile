FROM mcr.microsoft.com/dotnet/sdk:6.0

RUN apt-get update && \
    apt-get install -y jq \
    git \
    zip \
    unzip \
    default-jdk

ARG DC_VERSION=8.0.0 

# Download and configure OWASP Dependency-Check
RUN curl -LO https://github.com/jeremylong/DependencyCheck/releases/download/v${DC_VERSION}/dependency-check-${DC_VERSION}-release.zip \
    && unzip dependency-check-${DC_VERSION}-release.zip -d /opt/dependency-check \
    && rm dependency-check-${DC_VERSION}-release.zip

# Add OWASP Dependency-Check to the PATH
ENV PATH="/opt/dependency-check/dependency-check/bin:${PATH}"

# Set the working directory to /repo-dependency-checker
WORKDIR /repo-dependency-checker

# Copy the current directory contents to the container
COPY . /repo-dependency-checker

# Set executable permissions for the script
RUN chmod +x dep-checker.sh

# Start script
CMD ["./dep-checker.sh"]