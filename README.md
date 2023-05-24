# Repo Dependency Checker

- Node script to check dependencies from organisations repositories by using language and platform independent technologies (Makefile and Docker). The script will have three main steps:
  - Fetch all dependencies from a GitHub organisation (or file)
  - Exec all dependency check and audits on a dockerized environment.
  - Save all JSON format reports on the infrastructure reports subdirectory.

## Run

Before running the following commands, please ensure that you have set the GITHUB_KEY on your local environment as described below.

```bash
git clone `https://github.com/cabinetoffice/internal-dependency-checker.git`
cd internal-dependency-checker
make start ORG=`your_org` // es. make start ORG=co-cddo
make docker-build
make docker-up
```

### Create a Github token

1. Get a Github Token `https://github.com/settings/profile` then click 'developer settings'
2. Select personal access tokens and choose a classic token
3. Allow it to only have read:org read:packages read:public key: read:repo_hook and repo
4. Make the expiry short and keep renewing
5. Add this `export GITHUB_KEY="YOUR_KEY"` to your bash/zsh environments, ~/.bashrc or ~/.zshrc

## TO DO

- Cross check dependecy and double ckeck docker scripts (avoid contaminations)
- Create git Auth Token to get private repos
- Complete DOCs and Test coverage
