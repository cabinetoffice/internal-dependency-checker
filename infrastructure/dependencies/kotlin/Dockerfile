FROM openjdk:11

RUN apt-get update && apt-get install -y jq git curl unzip

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm awscliv2.zip

WORKDIR /idc

COPY . /idc

CMD ["./dep-checker.sh"]
