from utils import get_json
import time
from print_rate_limits import print_rate_limits

def find_all_dependencies(username, github_key, repository_name, dependency_file, page_number=None, all_dependencies=None):

    page_number = page_number if page_number else 1
    all_dependencies = all_dependencies if all_dependencies else list()

    url = f"https://api.github.com/search/code?q=filename:{dependency_file}+org:{username}+repo:{username}/{repository_name}&page={page_number}&per_page=5"

    headers, data = get_json(url, github_key)
    print_rate_limits(headers)

    all_dependencies += [{'name': file['name'], 'path': file['path'], 'url': file['url']} for file in data['items']]

    if (link := headers.get('link')) and 'rel="next"' in link:
        return find_all_dependencies(username, github_key, repository_name, dependency_file, page_number=page_number + 1, all_dependencies=all_dependencies)

    return all_dependencies

# https://api.github.com/search/code?q=filename:package.json+org:Harrisman05+repo:Harrisman05/dependency-test-repo&page=1&per_page=100
# https://api.github.com/search/code?q=filename:requirements.txt+org:Harrisman05+repo:Harrisman05/dependency-test-repo&page=1&per_page=100
# https://api.github.com/search/code?q=filename:pom.xml+org:Harrisman05+repo:Harrisman05/dependency-test-repo&page=1&per_page=100