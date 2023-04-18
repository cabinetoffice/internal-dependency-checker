import pytest

@pytest.fixture
def link_with_page():
    return 'https://example.com/somepage?page=3'

@pytest.fixture
def link_with_page_middle():
    return 'https://example.com/somepage/?page=4&sort=desc'

@pytest.fixture
def link_without_page():
    return 'https://example.com/somepage'

@pytest.fixture
def link_with_empty_page():
    return 'https://example.com/somepage/?page=&sort=asc'
