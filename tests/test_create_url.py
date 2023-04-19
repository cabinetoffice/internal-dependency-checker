import pytest
from query_api import create_url

# page = 1, check per page = 1 is in string
# per_page = 100, check substring contains 10
# check query string comes after page and per page
# test defaults and other values, that url is valid --> check url is valid using validator package? - https://validators.readthedocs.io/en/latest/

# Test case: check default page start value (1) is in returned url
def test_default_page_value_in_url(url_with_default_first_page_value):
    url = create_url(url_with_default_first_page_value)
    assert "?page=1" in url

# Test case: check default per page value (100) is in returned url
def test_default_per_page_value_in_url(url_with_default_per_page_value):
    url = create_url(url_with_default_per_page_value)
    assert "per_page=100" in url

# Test case: check changing page argument overrides the default value (1)
def test_changed_page_argument(url_with_changed_page_value):
    url = create_url(url_with_changed_page_value, page=43)
    assert "?page=43" in url # but this will pass if page=5, problem?

# Test case: check changing page argument overrides the default value (100)
def test_changed_per_page_argument(url_with_changed_per_page_value):
    url = create_url(url_with_changed_per_page_value, per_page=67)
    assert "&per_page=67" in url

# Test case: check added query string comes after page and per page
def test_query_string_added_at_url_end(url_with_query_string_to_be_added):
    query = 'q=sort=desc'
    url = create_url(url_with_query_string_to_be_added, query=query)
    assert url.endswith(query)