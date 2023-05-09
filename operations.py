from pprint import pprint


from dependency_data import dependency_data
import query_api
import db
import write_dependencies_to_file as wd
import generate_report as gr

# Runners

def _get_repos(cli_args):
    repo_names = query_api.get_repo_names(cli_args['github-username'], cli_args['github-key'])
    pprint(repo_names)

def _get_dep_files(cli_args):
    all_deps = query_api.get_dep_files(cli_args['github-username'], cli_args['repo-name'], cli_args['dep-file'], cli_args['github-key'])

    print("Writing to file...")

    wd.write_dependencies_to_file(cli_args['repo-name'], cli_args['github-key'], all_deps)

    pprint(all_deps)

def _generate_reports(cli_args):
    gr.make_report(cli_args['repos-root-dir'])
    

def _filter_reports(cli_args):
    db.loop_csv_to_json(cli_args['repos-root-dir'])

    
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

repos_root_dir = {
    'name': 'repos-root-dir'
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
                },   
    'filter-reports' : {
                    'params': [repos_root_dir],
                    'options': [],
                    'runner':_filter_reports,
                    'help': ''
                },
    'generate-reports' : {
                    'params': [repos_root_dir],
                    'options': [],
                    'runner':_generate_reports,
                    'help': ''
                } 
            
                
}
