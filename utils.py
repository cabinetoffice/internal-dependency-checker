import requests
import os
import time
from print_rate_limits import print_rate_limits

def get_json(url, github_key):
    headers = {}
    if github_key:
        headers["Authorization"] = f"token {github_key}"
    r = requests.get(url, headers=headers)
    return r.headers, r.json()

def dependencies_to_search(username, repository_name, github_key):
    dependencies = ['package.json', 'requirements.txt', 'pom.xml']
    dependencies_to_search = list()

    for dependency in dependencies:
        time.sleep(8)
        headers, data = get_json(f'https://api.github.com/search/code?q=filename:{dependency}+org:{username}+repo:{username}/{repository_name}&page=1&per_page=100', github_key)
        print(data)
        print_rate_limits(headers)
        if data['total_count']:
            print(f'{dependency} found')
            dependencies_to_search.append(dependency)
        else:
            print(f'{dependency} NOT found!')

    print(dependencies_to_search)

    return dependencies_to_search