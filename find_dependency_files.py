from utils import get_json
import time
from utils import dependencies_to_search
from print_rate_limits import print_rate_limits

def find_all_dependencies(username, github_key, repository_name, page_number=None, all_dependencies=None, deps_to_search=None, index=0):

    page_number = page_number if page_number else 1
    deps_to_search = deps_to_search if deps_to_search else dependencies_to_search(username, repository_name, github_key)
    all_dependencies = all_dependencies if all_dependencies else list()

    print(f'Dependencies to search: {deps_to_search}')

    time.sleep(5)

    url = f"https://api.github.com/search/code?q=filename:{deps_to_search[index]}+org:{username}+repo:{username}/{repository_name}&page={page_number}&per_page=5"

    headers, data = get_json(url, github_key)
    print_rate_limits(headers)

    all_dependencies += [{'name': file['name'], 'path': file['path'], 'url': file['url']} for file in data['items']]

    if (link := headers.get('link')) and 'rel="next"' in link:
        return find_all_dependencies(username, github_key, repository_name, page_number=page_number + 1, all_dependencies=all_dependencies, deps_to_search=deps_to_search, index=index)
    
    if len(deps_to_search) - index > 1 :
        return find_all_dependencies(username, github_key, repository_name, page_number=1, all_dependencies=all_dependencies, deps_to_search=deps_to_search, index=index+1)

    return all_dependencies

# https://api.github.com/search/code?q=filename:package.json+org:Harrisman05+repo:Harrisman05/dependency-test-repo&page=1&per_page=100
# https://api.github.com/search/code?q=filename:requirements.txt+org:Harrisman05+repo:Harrisman05/dependency-test-repo&page=1&per_page=100
# https://api.github.com/search/code?q=filename:pom.xml+org:Harrisman05+repo:Harrisman05/dependency-test-repo&page=1&per_page=100