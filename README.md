# Repo Dependency Checker

- Node script to check dependencies from organisations repositories by using language and platform independent technologies (Makefile and Docker). The script will have three main steps:
  - Fetch all dependencies from a GitHub organisation (or file)
  - Exec all dependency check and audits on a dockerized environment.
  - Save all JSON format reports on the infrastructure reports subdirectory.

## Run

```bash
git clone `https://github.com/cabinetoffice/internal-dependency-checker.git`
cd internal-dependency-checker
make start ORG=`your_org` // es. make start ORG=co-cddo
make docker-build
make docker-up
```

## TO DO

- Cross check dependecy and double ckeck docker scripts (avoid contaminations)
- Create git Auth Token to get private repos
- Complete DOCs and Test coverage
