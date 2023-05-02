import responses
from query_api import get_json

@responses.activate
def test_get_json():
    
    url = 'https://api.github.com/repos/octocat/Hello-World'
    github_key = 'my-secret-key'
    response_headers = {}
    response_json = {'foo': 'bar'}
    responses.add(responses.GET, url, headers=response_headers, json=response_json)

    headers, json_ = get_json(url, github_key)

    assert headers == {'Content-Type': 'application/json'}
    assert json_ == response_json


