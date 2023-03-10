import requests
import os
import time
from print_rate_limits import print_rate_limits

def get_json(url, github_key):
    headers = {}
    if github_key:
        headers["Authorization"] = f"token {github_key}"
    r = requests.get(url, headers=headers)
    return r.headers, r.json()