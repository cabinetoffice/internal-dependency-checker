FROM php:7.2

RUN apt-get update && \
    apt-get install -y jq \
    git \
    zip \
    unzip

# Install Composer 
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory to /idc
WORKDIR /idc

# Copy the current directory contents to the container
COPY . /idc

# Start script
CMD ["./dep-checker.sh"]