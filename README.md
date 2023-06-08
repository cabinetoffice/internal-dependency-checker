# Repo Dependency Checker

Node scripts to check for dependencies and vulnerabilities in an organization's repositories. The process involves several steps:

- Generating a comprehensive list of repositories.
- Cloning the repositories.
- Generating state dependencies and state vulnerabilities files.
- Creating containers specific to the programming language.
- Running the containers to generate reports in JSON format.

By following these steps, we ensure thorough analysis of dependencies and vulnerabilities across the organization's repositories.

## Run

Before running the following commands, please ensure that you have set the GITHUB_KEY on your local environment as described below.

```bash
git clone `https://github.com/cabinetoffice/internal-dependency-checker.git`
cd internal-dependency-checker
make start ORG=`your_org` // es. make start ORG=co-cddo
make clone
make state
make docker-build
make docker-up
```

### Test

```bash
make test
```

### Create a Github token

1. Get a Github Token `https://github.com/settings/profile` then click 'developer settings'
2. Select personal access tokens and choose a classic token
3. Allow it to only have read:org read:packages read:public key: read:repo_hook and repo
4. Make the expiry short and keep renewing
5. Add this `export GITHUB_KEY="YOUR_KEY"` to your bash/zsh environments, ~/.bashrc or ~/.zshrc

## TO DO

- Cross check dependecy and double ckeck docker scripts (avoid contaminations)
- Complete DOCs and Test coverage
