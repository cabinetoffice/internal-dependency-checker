import pytest
import query_api

header_no_link = {'Server': 'GitHub.com', 'Date': 'Wed, 19 Apr 2023 10:40:07 GMT', 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': '149'}

header_with_link = {'Server': 'GitHub.com', 'Date': 'Wed, 19 Apr 2023 10:40:07 GMT', 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': '149', 'link': 'page=2'}

json_ = {'message': 'Validation Failed', 'errors': [{'resource': 'Search', 'field': 'q', 'code': 'missing'}], 'documentation_url': 'https://docs.github.com/v3/search'}

def test_query_api(mocker):
    mocker.patch('query_api.get_json', return_value=(header_no_link, json_))
    pages = query_api.query_api('url', 'key')
    assert ' '.join([str(page) for page in pages]).count('message') == 1

def test_query_api_multiple_pages(mocker):
    mocker.patch('query_api.get_json', return_value=(header_with_link, json_))
    pages = query_api.query_api('url', 'key')
    assert ' '.join([str(page) for page in pages]).count('message') == 2

