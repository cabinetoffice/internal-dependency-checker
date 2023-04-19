#!/usr/bin/env python3

import os
from functools import reduce
from operator import concat

import requests

def get_json(url, github_key):
    headers = {}
    if github_key:
        headers["Authorization"] = f"token {github_key}"
    r = requests.get(url, headers=headers)
    return r.headers, r.json()

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
        return int(num)
    except ValueError:
        return 1


def create_url(url, query=None, page=1, per_page=100):
    url_ = f'{url}?page={page}&per_page={per_page}'
    if query:
        url_ = f'{url_}&{query}'
    return url_


def get_items(pages):
    try:
        return reduce(concat, [page['items'] for page in pages])
    except TypeError:
        return [item for page in pages for item in page]

# mocking query_api get_json with pytest-mock -> returns headers and json
# use responses library to test actual get_json function

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
    pass

# print(get_repo_names('harrisman05', os.environ['GITHUB_KEY']))
# print(get_dep_files('harrisman05', 'dependency-test-repo','requirements.txt', os.environ['GITHUB_KEY']))


