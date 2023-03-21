#!/usr/bin/env python3

import os
from functools import reduce
from operator import concat
from pprint import pprint
from utils import get_json
from utils import async_get_json
import asyncio
import time


def get_repo_names(username, github_key):
    url = f'https://api.github.com/users/{username}/repos'
    pages = query_api(url, github_key)
    return get_items(pages)


def get_dep_files(username, repo_name, dependency_file, github_key):
    url = f'https://api.github.com/search/code'
    query = f'q=filename:{dependency_file}+org:{username}+repo:{username}/{repo_name}'
    pages = query_api(url, github_key, query=query)
    return get_items(pages)


def get_num_pages(link):
    try:
        num = ''
        for char in link[link.rfind('?page=')+6:]:
            if char.isdigit():
                num += char
            else:
                break
        print(num)
        return int(num)
    except IndexError:
        return 1


def create_url(url, query=None, page=1, per_page=3): # BUG: fix bug if num of dep files > per_page, as len(get_dep_files) is too large. To investigate, but maybe duplicate data is being concatenated together. Also bug where running all_repos only returns first 25 repos if per_page is 5
    url_ = f'{url}?page={page}&per_page={per_page}'
    if query:
        url_ = f'{url_}&{query}'
    return url_


def get_items(pages):
    try:
        return reduce(concat, [page['items'] for page in pages])
    except TypeError:
        return [item for page in pages for item in page]
    except KeyError:
        print("You may have have hit the API request limit if you get this error unexpectedly")


def query_api(url, github_key, query=None):
    pages = []
    headers, data = asyncio.run(async_get_json(create_url(url, query=query), github_key))
    breakpoint()
    if (num_pages:= get_num_pages(headers.get('link', ''))) > 1:
        for i in range(1, num_pages + 1): # need + 1 to num_pages as second parameter is not inclusive in the range 
            print(f'num of pages: {num_pages}')
            headers, data = asyncio.run(async_get_json(create_url(url, query=query, page=i), github_key))
            pages.append(data)
    return pages

if __name__ == "__main__":
    # print(len(get_repo_names('cabinetoffice', os.environ['GITHUB_KEY'])))
    # pprint(get_dep_files('harrisman05', 'dependency-test-repo','package.json', os.environ['GITHUB_KEY']))
    pprint(get_dep_files('harrisman05', 'dependency-test-repo','requirements.txt', os.environ['GITHUB_KEY']))
    # pprint(len(get_dep_files('harrisman05', 'dependency-test-repo','requirements.txt', os.environ['GITHUB_KEY'])))
    print('Length of dep files:')
    # pprint(len(get_dep_files('harrisman05', 'dependency-test-repo','pom.xml', os.environ['GITHUB_KEY'])))


