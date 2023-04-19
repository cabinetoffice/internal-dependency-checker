import pytest

# get_num_pages() fixtures

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

@pytest.fixture
def link_with_page_no_number():
    return 'https://example.com/somepage?page='

# create_url() fixtures

@pytest.fixture
def url_with_default_first_page_value():
    return  'https://example.com/users/exampleuser/repos'

@pytest.fixture
def url_with_default_per_page_value():
    return  'https://example.com/users/exampleuser/repos'

@pytest.fixture
def url_with_changed_page_value():
    return  f'https://example.com/users/exampleuser/repos'

@pytest.fixture
def url_with_changed_per_page_value():
    return  f'https://example.com/users/exampleuser/repos'

@pytest.fixture
def url_with_query_string_to_be_added():
    return  f'https://example.com/search/code'
 

