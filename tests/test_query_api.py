import pytest
import query_api

def test_query_api(mocker, header_no_link, json_):
    mocker.patch('query_api.get_json', return_value=(header_no_link, json_))
    pages = query_api.query_api('url', 'key')
    assert ' '.join([str(page) for page in pages]).count('message') == 1

def test_query_api_multiple_pages(mocker, header_with_link, json_):
    mocker.patch('query_api.get_json', return_value=(header_with_link, json_))
    pages = query_api.query_api('url', 'key')
    assert ' '.join([str(page) for page in pages]).count('message') == 2

