#!/usr/bin/env python3

import os
from functools import reduce
from operator import concat
from pprint import pprint
from utils import get_json


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
        return int(link[link.rfind('page=') + 5])
    except IndexError:
        return 1


def create_url(url, query=None, page=1, per_page=5):
    url_ = f'{url}?page={page}&per_page={per_page}'
    if query:
        url_ = f'{url_}&{query}'
    return url_


def get_items(pages):
    try:
        return reduce(concat, [page['items'] for page in pages])
    except TypeError:
        return [item for page in pages for item in page]


def query_api(url, github_key, query=None):
    pages = []
    headers, data = get_json(create_url(url, query=query), github_key)
    pages.append(data)
    if (num_pages:= get_num_pages(headers.get('link', ''))) > 1:
        for i in range(1, num_pages):
            headers, data = get_json(create_url(url, query=query, page=i), github_key)
            pages.append(data)
    return pages

if __name__ == "__main__":
    # print(get_repo_names('harrisman05', os.environ['GITHUB_KEY']))
    # print(get_dep_files('harrisman05', 'dependency-test-repo','requirements.txt', os.environ['GITHUB_KEY']))
    pprint(len(get_dep_files('harrisman05', 'dependency-test-repo','package.json', os.environ['GITHUB_KEY'])))
    pprint(len(get_dep_files('harrisman05', 'dependency-test-repo','requirements.txt', os.environ['GITHUB_KEY'])))
    pprint(len(get_dep_files('harrisman05', 'dependency-test-repo','pom.xml', os.environ['GITHUB_KEY'])))


