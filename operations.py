from pprint import pprint

import query_api

# Runners

def _get_repos(cli_args):
    repo_names = query_api.get_repo_names(cli_args['github-username'], cli_args['github-key'])
    pprint(repo_names)

def _get_dep_files(cli_args):
    all_deps = query_api.get_dep_files(cli_args['github-username'], cli_args['repo-name'], cli_args['dep-file'], cli_args['github-key'])
    pprint(all_deps)
    
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

github_key = {
    'name': 'github-key'
}

# Options
# None at present

# Operations
subcommands = {

    'get-repos' : {
                    'params': [github_username, github_key],
                    'options': [],
                    'runner': _get_repos,
                    'help': ''
                },
    'get-dep-files' : {
                    'params': [github_username, repo_name, dep_file, github_key],
                    'options': [],
                    'runner': _get_dep_files,
                    'help': ''
                }                
}
