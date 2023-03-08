import os
from utils import get_json
import time
from print_rate_limits import print_rate_limits
from pprint import pprint

GITHUB_KEY = os.environ["GITHUB_KEY"]
USERNAME = 'cabinetoffice'
DEPENDENCY_FILE = 'package.json'

def find_all_dependencies(username, github_key, repository_name, page_number=None, all_dependencies=None):

    dependency_file = 'package.json'
    page_number = page_number if page_number else 1
    all_dependencies = all_dependencies if all_dependencies else list()

    url = f"https://api.github.com/search/code?q=filename:{dependency_file}+org:{username}+repo:{username}/{repository_name}&page={page_number}&per_page=3"

    headers, data = get_json(url, github_key)

    all_dependencies += [{'name': file['name'], 'path': file['path'], 'url': file['url']} for file in data['items']]

    if (link := headers.get('link')) and 'rel="next"' in link:
        time.sleep(1)
        return find_all_dependencies(username, github_key, repository_name, page_number=page_number + 1, all_dependencies=all_dependencies)

    return all_dependencies


# find_all_dependencies('cabinetoffice', 'co-papt-prototype', 'package.json')

# https://api.github.com/search/code?q=filename:package.json+org:harrisman05+repo:harrisman05/React&page=1&per_page=100

# https://api.github.com/search/code?q=filename:package.json+org:cabinetoffice+repo:cabinetoffice/co-papt-prototype&page=1&per_page=100