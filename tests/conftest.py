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
def example_url():
    return  'https://example.com/users/exampleuser/repos'
 
# query_api() fixtures

@pytest.fixture
def header_no_link():
    return  {'Server': 'GitHub.com', 'Date': 'Wed, 19 Apr 2023 10:40:07 GMT', 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': '149'}

@pytest.fixture
def header_with_link():
    return  {'Server': 'GitHub.com', 'Date': 'Wed, 19 Apr 2023 10:40:07 GMT', 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': '149', 'link': 'page=2'}

@pytest.fixture
def json_():
    return  {'message': 'Validation Failed', 'errors': [{'resource': 'Search', 'field': 'q', 'code': 'missing'}], 'documentation_url': 'https://docs.github.com/v3/search'}