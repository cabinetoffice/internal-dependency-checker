import requests
import os

def get_json(url):

    GITHUB_KEY = os.environ["GITHUB_KEY"]
    headers = {}
    if GITHUB_KEY:
        headers["Authorization"] = f"token {GITHUB_KEY}"

    r = requests.get(url, headers=headers)
    return r.headers, r.json()