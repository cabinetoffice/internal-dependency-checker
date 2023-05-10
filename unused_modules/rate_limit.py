from datetime import datetime

class RateLimit:

    def __init__(self, headers):
        self._update(headers)

    def __repr__(self):
        return f'{self.used} used, {self.remaining} remainging of {self.limit} requests. Reset at {self.reset_time()}'

    def _update(self, headers):
        self.limit = headers["X-RateLimit-Limit"]
        self.remaining = headers["X-RateLimit-Remaining"]
        self.used = headers["X-RateLimit-Used"]
        self._reset_timestamp = headers["X-RateLimit-Reset"]

    def reset_time(self):
        return datetime.fromtimestamp(int(self._reset_timestamp))


