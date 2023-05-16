# Repo Dependency Checker

- Node script to check dependencies from organization's repositories.
  - First will fetch all dependencies from a github organization (or file)
  - Second exec all dependency check and audits on a dockerized environment.
  - All results will be save on the infrastructure/reports in JSON format.

## Run

- git clone `https://github.com/Mouhajer-CO/repo-dependency-checker.git`
- cd repo-dependency-checker
- make start ORG=`your_org` // es. make start ORG=co-cddo
- make docker-build
- make docker-up

## TO DO

- Cross check dependecy and double ckeck docker scripts (avoid contaminations)
- Create git Auth Token to get private repos
- Complete DOCs and Test coverage
