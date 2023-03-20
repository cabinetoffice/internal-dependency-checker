import requests
import os
import time
from print_rate_limits import print_rate_limits
import aiohttp
import asyncio
from pprint import pprint

def get_json(url, github_key):
    headers = {}
    if github_key:
        headers["Authorization"] = f"token {github_key}"
    r = requests.get(url, headers=headers)
    return r.headers, r.json()

# tells Python that this is a co-routine, ran with asyncio event loop
async def async_request_standalone(username, repo_name, dependency_file, github_key):

    headers = {}
    if github_key:
        headers["Authorization"] = f"token {github_key}"

    # opening aiohttp client session, kind of like a connection pool?
    async with aiohttp.ClientSession() as session: 

        async with session.get(f'https://api.github.com/search/code?q=filename:{dependency_file}+org:{username}+repo:{username}/{repo_name}', headers=headers) as r:
            data = await r.json()
            pprint(data)
            pprint(r.headers)
            return r.headers, r.json
        
async def async_request_query_api(url, github_key):

    headers = {}
    if github_key:
        headers["Authorization"] = f"token {github_key}"

    async with aiohttp.ClientSession() as session: 

        async with session.get(url, headers=headers) as r:
            data = await r.json()
            pprint(data)
            pprint(r.headers)
            return r.headers, r.json

# all_repos_url = f'https://api.github.com/users/{username}/repos'
# single_repo_url = f'https://api.github.com/search/code?q=filename:{dependency_file}+org:{username}+repo:{username}/{repo_name}'

# asyncio.run(async_request('harrisman05', 'dependency-test-repo','package.json', os.environ['GITHUB_KEY']))
