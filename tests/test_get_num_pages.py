import pytest
from query_api import get_num_pages

# Test case: Valid link with '?page='
def test_get_num_pages_with_valid_link(link_with_page):
    result = get_num_pages(link_with_page)
    expected = 3
    assert result == expected

# Test case: Valid link with '?page=' in the middle
def test_get_num_pages_with_valid_middle_link(link_with_page_middle):
    result = get_num_pages(link_with_page_middle)
    expected = 4
    assert result == expected

# Test case: Invalid link without '?page='
def test_get_num_pages_with_invalid_link_without_page(link_without_page):
    with pytest.raises(ValueError):
        result = get_num_pages(link_without_page)

# Test case: Invalid link without digits after '?page='
def test_get_num_pages_with_invalid_link_with_empty_page(link_with_empty_page):
    with pytest.raises(ValueError):
        result = get_num_pages(link_with_empty_page)