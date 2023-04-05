#!/usr/bin/env python3

import os
from functools import reduce
from operator import concat
from pprint import pprint
from utils import get_json
from utils import async_get_json
import asyncio
import time


async def get_repo_names(username, github_key):
    url = f'https://api.github.com/users/{username}/repos'
    pages = await query_api(url, github_key)
    items = get_items(pages)
    return [item['name'] for item in items]


async def get_dep_files(username, repo_name, dependency_file, github_key):
    url = f'https://api.github.com/search/code'
    query = f'q=filename:{dependency_file}+org:{username}+repo:{username}/{repo_name}'
    pages = await query_api(url, github_key, query=query)
    items = get_items(pages)
    return [{'name': item['name'], 'path': item['path'], 'url': item['url']} for item in items]


def get_num_pages(link):
    try:
       # list comprehension --> num = ''.join([char for char in link[link.rfind('?page=')+6:] if char.isdigit()])
        num = ''
        for char in link[link.rfind('?page=')+6:]:
            if char.isdigit():
                num += char
            else:
                break
        return int(num)
    except IndexError:
        return 1


def create_url(url, query=None, page=1, per_page=30):
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


async def query_api(url, github_key, query=None):
    pages = []
    headers, data = await async_get_json(create_url(url, query=query), github_key)
    time.sleep(3) # avoid API overloading
    pages.append(data)
    if headers.get('link'): # 'link' is always None if there's only 1 page
        (num_pages:= get_num_pages(headers.get('link')))
        for i in range(2, num_pages + 1): # Start on page 2 as page 1 data appended above. Need + 1 to num_pages as second parameter is not inclusive in the range. 
            headers, data = await async_get_json(create_url(url, query=query, page=i), github_key)
            time.sleep(3)
            pages.append(data)
    return pages

if __name__ == "__main__":
    # print(len(asyncio.run(get_repo_names('cabinetoffice', os.environ['GITHUB_KEY'])))) # expected output - 74
    print(len(asyncio.run(get_dep_files('harrisman05', 'dependency-test-repo','package.json', os.environ['GITHUB_KEY'])))) # expected output - 8
    print(len(asyncio.run(get_dep_files('harrisman05', 'dependency-test-repo','requirements.txt', os.environ['GITHUB_KEY'])))) # expected output - 4
    print(len(asyncio.run(get_dep_files('harrisman05', 'dependency-test-repo','pom.xml', os.environ['GITHUB_KEY'])))) # expected output - 4


