FROM adoptopenjdk:11-jre-hotspot

# Set the working directory to /repo-dependency-checker
WORKDIR /repo-dependency-checker

# Copy the current directory contents to the container
COPY . /repo-dependency-checker

# Start script
CMD ["./dep-checker.sh"]
