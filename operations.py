import get_repos

# Runners

def _get_repos(cli_args):
    get_repos.get_repo_names(cli_args['github-username'])

# Parameters
github_username = {
    'name': 'github-username',
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
                }
}
