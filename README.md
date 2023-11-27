# IDC - Internal Dependency Checker

## Overview

The following tool is used to create a snapshot of the status of our repositories within the organization. To analyze and gain insights from the JSON audit files and other information (e.g., git user and repository info), the Elasticsearch and Kibana (E&K) solution has been chosen. This solution provides functionality for analyzing, aggregating, and filtering data. Furthermore, Elasticsearch can efficiently store and index this data in a way that supports fast searches.

Kibana is used to query and visualize the data stored in Elasticsearch. The Kibana dashboard serves as a user-friendly interface, allowing users to easily explore and identify vulnerabilities in the software across the organization(s). It facilitates efficient tracking and monitoring of security issues, thereby facilitating remediation efforts.

In the initial stages of the IDC, information will be collected and then fed in bulk to Elasticsearch during the bootstrap process, however, in the future, the service will continuously receive updated information on the status of our repositories. Whenever a repository is updated, a task in our CI/CD pipeline will be triggered to initiate the check. The results of this check will then be compiled into a report and sent to dedicated storage. This setup ensures that we have real-time data on the status of our services and can access historical reports for analysis and review

## Required

- NodeJs v20
- Docker (make sure disk space allocated to docker is enough)
- Make (command)
- GITHUB_KEY config (check section below)

## Stages

### First stage

First stage involves running node scripts. This stage includes the creation of state files, obtaining repository information, and cloning the repositories. These state files will be utilized/fetched by the dependency bash script in the container during the next stage.

### Second stage

Second stage, the docker-compose build and docker-compose up commands will be executed. Each running container will perform audits and checks for vulnerabilities and security issues, for each project, which will then be saved in a related folder within the (infrastructure/report directory).

### Third stage

The E&K dashboard will serve as a platform to visualize GitHub repository details and search/visualization vulnerabilities obtained from previous checks on stage two, through the Kibana dashboard.

## Run

```bash
git clone https://github.com/cabinetoffice/internal-dependency-checker.git
cd internal-dependency-checker

# I Stage
make build
make start ORG=ORG_NAME # es. make start ORG=co-cddo
make clone
make state
# II Stage
make docker-build
make docker-up
# III Stage
make start-elasticsearch # Build and start Elasticsearch and Kibana on dev mode (on localhost:5601). Configurations can vary, so it's crucial to ensure that you set environment variables accordingly.
```

### Test

```bash
make test
or
make coverage
```

### Create a Github token

1. Get a Github Token `https://github.com/settings/profile` then click 'developer settings'
2. Select personal access tokens and choose a classic token
3. Allow it to only have: `read:packages`, `read:org`, `read:repo_hook`, `read:public_key`, `read:user` and `repo`
4. Make the expiry short and keep renewing
5. Add this `export GITHUB_KEY="YOUR_KEY"` to your bash/zsh environments, `~/.bashrc` or `~/.zshrc`

## CLI usage

Run `npm run help` for guide on how to run the tool through the CLI, remember to build the project first with `npm run build` (or `make build`).

```txt
$ npm run help

> internal-dependency-checker@1.0.0 help
> ./dist/cli.js --help

Usage: ./dist/cli.js <Command> [main <ORG>|clone|state] <Options>

Commands:
  cli.js main <ORG>  Generating a list of repositories on a repos info file.
  cli.js clone       Cloning repositories listed on repos info file.
  cli.js state       Generating state dependencies and state vulnerabilities
                     files.

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Examples:
  ./dist/cli.js main <ORG>  Create repositories info file
  ./dist/cli.js clone       Clone repos
  ./dist/cli.js state       Create state files

Copyright (c) 2023 Cabinet Office - MIT License
```

### DOCs

Further documentation and code overview can be found [here](https://github.com/cabinetoffice/internal-dependency-checker/tree/main/docs).
