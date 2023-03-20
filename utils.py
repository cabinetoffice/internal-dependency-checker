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
async def async_request(username, repo_name, dependency_file, github_key):

    headers = {}
    if github_key:
        headers["Authorization"] = f"token {github_key}"

    # opening aiohttp client session, kind of like a connection pool?
    async with aiohttp.ClientSession() as session: 

        url = f'https://api.github.com/users/{username}/repos'   # async request made 
        async with session.get(url, headers=headers) as resp:
            data = await resp.json()
            pprint(data)

asyncio.run(async_request('harrisman05', 'dependency-test-repo','package.json', os.environ['GITHUB_KEY']))