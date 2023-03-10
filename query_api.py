from utils import get_json
import time
from print_rate_limits import print_rate_limits
import os

def query_api(username, github_key, repo_name=None, dependency_file=None, output_data=None, page_number=None):

    all_repo_names_url = f"https://api.github.com/users/{username}/repos?page={page_number}&per_page=5"
    all_dependencies_single_repo_url = f"https://api.github.com/search/code?q=filename:{dependency_file}+org:{username}+repo:{username}/{repo_name}&page={page_number}&per_page=5"
    page_number = page_number if page_number else 1
    output_data = output_data if output_data else list()
    url = all_dependencies_single_repo_url if repo_name else all_repo_names_url

    headers, data = get_json(url, github_key)
    # print_rate_limits(headers)

    if repo_name:
        output_data += [{'name': file['name'], 'path': file['path'], 'url': file['url']} for file in data['items']]
    else: 
        output_data += [item['name'] for item in data]
    
    if (link := headers.get('link')) and 'rel="next"' in link:
        return query_api(username, github_key, repo_name, dependency_file, output_data, page_number=page_number + 1)
    
    # print(output_data)
    # print(len(output_data))
    return output_data

if __name__ == "__main__":
    # query_api('harrisman05', os.environ['GITHUB_KEY'], 'dependency-test-repo','requirements.txt')
    # query_api('cabinetoffice', os.environ['GITHUB_KEY'])
    pass