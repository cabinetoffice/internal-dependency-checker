#!/usr/bin/env python3

import os
import requests
from pprint import pprint


USERNAME='cabinetoffice'
GITHUB_KEY = os.environ["GITHUB_KEY"]


# TODO Requests error handling

def get_json(url, headers):
    r = requests.get(url, headers=headers)
    return r.headers, r.json()


def get_repo_names(username):
    all_repo_names = []
    page_number = 1
    per_page = 100
    pages_remaining = True
    while_count = 0

    # Make get request to fetch data of all repos and convert to JSON

    while pages_remaining:
        current_url = f"https://api.github.com/users/{username}/repos?page={page_number}&per_page={per_page}"
        print("")
        print(f"while_count - {while_count}")

        headers, data = get_json(current_url, {'Authorisation': f'token {GITHUB_KEY}'})
        # breakpoint()
        # Loop through data JSON object to extract all repo names

        all_repo_names += [item['name'] for item in data]

        print(all_repo_names)

        # nextPattern = 'rel="next"'
        # link = get_next_page_link_request(current_url) # get string
        link = headers.get('link')

        # if link and nextPattern in link:
        if link and 'rel="next"' in link:
            print("Found next pattern in link, continue to next page")
            page_number += 1
            while_count += 1
            print(current_url)
        else:
            print("Can't find next pattern, must be last page")
            pages_remaining = False

    pprint(all_repo_names)

    return all_repo_names


if __name__ == "__main__":
    get_repo_names(USERNAME)

