import requests
import os
# from get_json import get_json
from datetime import datetime
import humanfriendly

def print_rate_limits(headers):

    rate_limit = headers["X-RateLimit-Limit"]
    print(f'Requests allowed in current period: {rate_limit}')

    rate_limit_remaining = headers["X-RateLimit-Remaining"]
    print(f'Requests remaining in current period: {rate_limit_remaining}')

    rate_limit_used = headers["X-RateLimit-Used"]
    print(f'Requests used in current period: {rate_limit_used}')

    rate_limit_reset = headers["X-RateLimit-Reset"]
    time_now = datetime.now()
    reset_timestamp_unix = int(rate_limit_reset)
    reset_time = datetime.fromtimestamp(reset_timestamp_unix)
    time_diff = humanfriendly.format_timespan(reset_time - time_now)

    print(f'When rate limit will reset: In about {time_diff} --> {reset_time:%Y-%m-%d %H:%M:%S}')
