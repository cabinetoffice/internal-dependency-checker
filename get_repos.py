#!/usr/bin/env python3

import os
import requests
from pprint import pprint
from utils import get_json
# from get_json import get_json
from print_rate_limits import print_rate_limits

# USERNAME = 'cabinetoffice'

# TODO Requests error handling

# def get_repo_names(username, github_key):
#     all_repo_names = []
#     page_number = 1
#     per_page = 100
#     pages_remaining = True
#     while_count = 0

#     while pages_remaining:
#         current_url = f"https://api.github.com/users/{username}/repos?page={page_number}&per_page={per_page}"
#         print("")
#         print(f"while_count - {while_count}")

#         headers, data = get_json(current_url, github_key)
#         print_rate_limits(headers)

#         all_repo_names += [item['name'] for item in data]

#         link = headers.get('link')

#         if link and 'rel="next"' in link:
#             print("Found next pattern in link, continue to next page")
#             page_number += 1
#             while_count += 1
#             print(current_url)
#         else:
#             print("Can't find next pattern, must be last page")
#             pages_remaining = False

#     return all_repo_names


def get_repo_names(username, github_key, page_number=None, all_repo_names=None):
    page_number = page_number if page_number else 1
    all_repo_names = all_repo_names if all_repo_names else list()

    url = f"https://api.github.com/users/{username}/repos?page={page_number}&per_page=5"

    headers, data = get_json(url, github_key)

    all_repo_names += [item['name'] for item in data]
    print(len(all_repo_names))

    if not (link := headers.get('link')) or 'rel="next"' not in link:
        breakpoint()
        return
    else:
        get_repo_names(username, github_key, page_number=page_number + 1, all_repo_names=all_repo_names)
    return all_repo_names

    # if (link := headers.get('link')) and 'rel="next"' in link:
    #     get_repo_names(username, github_key, page_number=page_number + 1, all_repo_names=all_repo_names)
    #     # return
    # else:
    #     print('End')
    #     print(all_repo_names)
    #     breakpoint()
    # breakpoint()
    # return all_repo_names
    # return True

if __name__ == "__main__":
    pass
