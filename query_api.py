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
    items = get_items(pages)
    return [item['name'] for item in items]


def get_dep_files(username, repo_name, dependency_file, github_key):
    url = f'https://api.github.com/search/code'
    query = f'q=filename:{dependency_file}+org:{username}+repo:{username}/{repo_name}'
    pages = query_api(url, github_key, query=query)
    items = get_items(pages)
    return [{'name': item['name'], 'path': item['path'], 'url': item['url']} for item in items]


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
    url_ = url
    if query:
        url_ = f'{url_}?{query}&page={page}&per_page={per_page}'
    else:
        url_ = f'{url_}?page={page}&per_page={per_page}'
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
    pass


