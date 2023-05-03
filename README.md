# internal-vulnerable-dependency-checker-prototype

## Overview

A prototype CLI tool built with Python used to scan Github repositories for dependency files. Once the dependency files are scanned, their contents can be written to file and then can be analysed using the OWASP CLI tool. 

## Pre-requisites to run prototype

- Python
- OWASP CLI tool (Guide to set-up here -
https://github.com/jeremylong/DependencyCheck)


## Configuration

Create a Github token as below:

1) Get a Github Token https://github.com/settings/profile then click 'developer settings'
2) Select personal access tokens and choose a classic token
3) Allow it to only have read:org read:packages read:public key: read:repo_hook and repo
4) Make the expiry short and keep renewing
5) Store these in your shell ~/.bashrc export 'GITHUB_KEY' = 'yourkey'
6) Pull these from Python environment variables command os.environ['GITHUB_KEY']
7) Form a web request to the https://api.github.com/orgs/CabinetOffice/repos with Authorization : Bearer

## Running the tool on the CLI

The tool is run by navigating to the root directory of the project and running commands on the CLI. The tool currently can perform 2 main actions in isolation:

1) For a given Github username, get all repository names:

`
$ python3 run.py get-repos <github_username> $GITHUB_KEY
`
* Sample output in terminal: 

`['repo1', 'some_repo2', 'last_repo3']`

2) For a given repository and dependency filetype, extract all dependency names, dependency file paths and dependency content urls:

`
$ python3 run.py get-dep-files <github_username> <github_repository_name> <package.json> $GITHUB_KEY
`

* Sample output in terminal:

```
[{'name': 'package.json',
  'path': 'package.json',
  'url': 'https://api.github.com/repositories/111111111/contents/package.json?ref=111111111111111111111111111111111111'},
 {'name': 'package.json',
  'path': 'node_subdir/node_subdir_1/node_subdir_2/package.json',
  'url': 'https://api.github.com/repositories/111111111/contents/node_subdir/node_subdir_1/node_subdir_2/package.json?ref=111111111111111111111111111111111111'},
 {'name': 'package.json',
  'path': 'node_subdir/node_subdir_1/package.json',
  'url': 'https://api.github.com/repositories/111111111/contents/node_subdir/node_subdir_1/package.json?ref=111111111111111111111111111111111111'},
 {'name': 'package.json',
  'path': 'node_subdir/package.json',
  'url': 'https://api.github.com/repositories/111111111111/contents/node_subdir/package.json?ref=1111111111111111111111111111111111111111'}]
```
NOTE: Repository is recursively searched, so nested dependency files are extracted.