import pytest
import validators
from query_api import create_url

# Test case: check default page start value (1) is in returned url
def test_default_page_value_in_url(example_url):
    url = create_url(example_url)
    assert "?page=1" in url

# Test case: check default per page value (100) is in returned url
def test_default_per_page_value_in_url(example_url):
    url = create_url(example_url)
    assert "per_page=100" in url

# Test case: check changing page argument overrides the default value (1)
def test_changed_page_argument(example_url):
    url = create_url(example_url, page=43)
    assert "?page=43" in url

# Test case: check changing page argument overrides the default value (100)
def test_changed_per_page_argument(example_url):
    url = create_url(example_url, per_page=67)
    assert "&per_page=67" in url

# Test case: check added query string comes after page and per page
def test_query_string_added_at_url_end(example_url):
    query = 'q=sort=desc'
    url = create_url(example_url, query=query)
    assert url.endswith(query)

# Test case: validate that returned url is valid
def test_returned_url_is_valid_url(example_url):
    url = create_url(example_url)
    assert validators.url(url)