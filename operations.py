from pprint import pprint

import get_repos
import find_dependency_files
import query_api

# Runners

def _get_repos(cli_args):
    rn = get_repos.get_repo_names(cli_args['github-username'], cli_args['github_key'])
    pprint(rn)

def _check_single_repo(cli_args):
    all_deps = find_dependency_files.find_all_dependencies(cli_args['github-username'], cli_args['github_key'], cli_args['repo-name'], cli_args['dep-file'])
    pprint(all_deps)
    pprint(len(all_deps))

def _query_api(cli_args):
    data = query_api.query_api(cli_args['github-username'], cli_args['github_key'])
    print(data)
    print(len(data))
    
    
# Parameters
github_username = {
    'name': 'github-username',
}

repo_name = {
    'name': 'repo-name',
}

dep_file = {
    'name': 'dep-file',
}

# Options
github_key = {
    'short': '-k',
    'long': '--github-key',
}
dependency_file = {
    'short': '-d',
    'long': '--dependency-file'
}
repo_name = {
    'short': '-rn',
    'long:': '--repo-name'
}

# Operations
subcommands = {

    'get-repos' : {
                    'params': [github_username],
                    'options': [github_key],
                    'runner': _get_repos,
                    'help': ''
                },
    'check-repo' : {
                    'params': [github_username, repo_name, dep_file],
                    'options': [github_key],
                    'runner': _check_single_repo,
                    'help': ''
                },
    'query-api' : {
                    'params': [github_username],
                    'options': [github_key, dependency_file, repo_name],
                    'runner': _query_api,
                    'help': ''
                },
                
}
