import requests
import os

# must be authenticated to access the code search in API
def test_github_api_token():
    dependency_file = 'package.json'
    username = 'harrisman05'
    repo_name = 'dependency-test-repo'

    url = f'https://api.github.com/search/code?q=filename:{dependency_file}+org:{username}+repo:{username}/{repo_name}'
    github_key = os.environ['GITHUB_KEY']
    headers = {}
    headers["Authorization"] = f"token {github_key}"
    r = requests.get(url, headers=headers)
    
    print(r.json())
    assert r.status_code == 200