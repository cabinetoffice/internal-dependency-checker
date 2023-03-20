import requests
from print_rate_limits import print_rate_limits
import aiohttp
from pprint import pprint

def get_json(url, github_key):
    headers = {}
    if github_key:
        headers["Authorization"] = f"token {github_key}"
    r = requests.get(url, headers=headers)
    return r.headers, r.json()

# creates a coroutine, which we are running with the asyncio event loop
async def async_get_json(url, github_key):

    headers = {}
    if github_key:
        headers["Authorization"] = f"token {github_key}"

    # opening aiohttp client session, kind of like a connection pool?
    async with aiohttp.ClientSession() as session: 

        async with session.get(url, headers=headers) as r:
            data = await r.json()
            headers =  r.headers
            return headers, data

# all_repos_url = f'https://api.github.com/users/{username}/repos'
# single_repo_url = f'https://api.github.com/search/code?q=filename:{dependency_file}+org:{username}+repo:{username}/{repo_name}'

# asyncio.run(async_request('harrisman05', 'dependency-test-repo','package.json', os.environ['GITHUB_KEY']))
