import requests
import os
from get_json import get_json
from print_rate_limits import print_rate_limits

GITHUB_KEY = os.environ["GITHUB_KEY"]
USERNAME = 'cabinetoffice'
DEPENDENCY_FILE = 'package.json'

def find_node_modules(username, repository_name):

    url = f"https://api.github.com/search/code?q=path:node_modules+org:{username}+repo:{username}/{repository_name}&page=1&per_page=100"

    headers, data = get_json(url)
    print_rate_limits(headers)

    if data["total_count"] > 1:
        print("node_modules has been pushed. Healthcheck failed")
    else:
        print("Healthcheck passed")

find_node_modules('cabinetoffice', 'co-papt-prototype')

# https://github.com/orgs/community/discussions/21894