FROM openjdk:11

RUN apt-get update && apt-get install -y jq git

WORKDIR /repo-dependency-checker

COPY . /repo-dependency-checker

CMD ["./dep-checker.sh"]
