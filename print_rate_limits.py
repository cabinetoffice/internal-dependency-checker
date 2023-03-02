import requests
import os
from get_json import get_json

def print_rate_limits(url):

    headers, data = get_json(url)

    rate_limit = headers["X-RateLimit-Limit"]
    print(f'Requests allowed per minute: {rate_limit}')

    rate_limit_reset = headers["X-RateLimit-Reset"]
    print(f'When rate limit will reset (unix): {rate_limit_reset}')

    rate_limit_remaining = headers["X-RateLimit-Remaining"]
    print(f'Requests remaining for current minute: {rate_limit_remaining}')

    rate_limit_used = headers["X-RateLimit-Used"]
    print(f'Request used in current minute: {rate_limit_used}')