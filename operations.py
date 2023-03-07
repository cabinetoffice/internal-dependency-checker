from pprint import pprint

import get_repos
import find_dependency_files

# Runners

def _get_repos(cli_args):
    get_repos.get_repo_names(cli_args['github-username'])


def _check_single_repo(cli_args):
    all_deps = find_dependency_files.find_all_dependencies(cli_args['github-username'], cli_args['repo-name'], cli_args['dep-file'])
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

# Options
github_key = {
    'short': '-k',
    'long': '--github-key',
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
                }
}
