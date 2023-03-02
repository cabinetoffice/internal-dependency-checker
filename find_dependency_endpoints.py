import requests
import os

GITHUB_KEY = os.environ["GITHUB_KEY"]
USERNAME = 'cabinetoffice'
DEPENDENCY_FILE = 'package.json'

def get_json(url, headers):
    r = requests.get(url, headers=headers)
    return r.headers, r.json()

def find_all_dependencies(username, repository_name, dependency_file):

    print(f'Searching {repository_name} for {dependency_file}...')
    # Retrieve all dependency file locations within root and all subdirectories of repo

    # https://api.github.com/search/code?q=filename:package.json+org:harrisman05+repo:harrisman05/React&page=1&per_page=100

    url = f"https://api.github.com/search/code?q=filename:{dependency_file}+org:{username}+repo:{username}/{repository_name}&page=1&per_page=100"

    data = get_json(url, {'Authorisation': f'token {GITHUB_KEY}'})

    all_dependencies = data[1]["items"]

    print(all_dependencies)

    return all_dependencies

# find_all_dependencies()