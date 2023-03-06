import requests
import os
from get_json import get_json
from print_rate_limits import print_rate_limits

GITHUB_KEY = os.environ["GITHUB_KEY"]
USERNAME = 'cabinetoffice'
DEPENDENCY_FILE = 'package.json'

def find_all_dependencies(username, repository_name, dependency_file):

    print(f'Searching {repository_name} for {dependency_file}...')
    # Retrieve all dependency file locations within root and all subdirectories of repo

    # https://api.github.com/search/code?q=filename:package.json+org:harrisman05+repo:harrisman05/React&page=1&per_page=100

    # https://api.github.com/search/code?q=filename:package.json+org:cabinetoffice+repo:cabinetoffice/co-papt-prototype&page=1&per_page=100

    url = f"https://api.github.com/search/code?q=filename:{dependency_file}+org:{username}+repo:{username}/{repository_name}&page=1&per_page=100"

    print("Rate limit is 30 repos per minute")


    headers, data = get_json(url)
    print_rate_limits(headers)

    all_dependencies = data["items"]

    # Warning if there are more than 100 dep files at endpoint (only 100 can be loaded at a max)

    if data["total_count"] > 100: 
        print("WARNING:  More than 100 dependency files detected in repo. Only 100 can be loaded at this endpoint")

    return all_dependencies

# find_all_dependencies('cabinetoffice', 'co-papt-prototype', 'package.json')