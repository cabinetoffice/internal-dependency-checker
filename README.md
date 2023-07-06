# Repo Dependency Checker

Node scripts to check for dependencies and vulnerabilities in an organization's repositories. The process involves several steps:

- Generating a comprehensive list of repositories.
- Cloning the repositories.
- Generating state dependencies and state vulnerabilities files.
- Creating containers specific to the programming language.
- Running the containers to generate reports in JSON format.

By following these steps, we ensure thorough analysis of dependencies and vulnerabilities across the organization's repositories.

## Required

- NodeJs v18
- Docker
- Make (command)
- GITHUB_KEY config (check section below)

## Run

```bash
git clone https://github.com/cabinetoffice/internal-dependency-checker.git
cd internal-dependency-checker

make build
make start ORG=ORG_NAME # es. make start ORG=co-cddo
make clone
make state
make docker-build
make docker-up
```

## CLI usage

Run `npm run help` for guide on how to run the tool through the CLI, remember to build the project first with `npm run build` (or `make build`).

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
