#!/usr/bin/env python3

import argparse

import operations
from get_repos import get_repo_names
from create_repo_directory import create_project_directory
from find_dependency_endpoints import find_all_dependencies
from write_dependencies_to_file import write_dependencies_to_file

# def main():
#     USERNAME = 'cabinetoffice'
#     DEPENDENCY_FILE = 'package.json'
#     TIME_SLEEP = 20

#     single_repo = 'co-papt-prototype'

#     all_repo_names = get_repo_names(USERNAME)

#     create_project_directory(single_repo)

#     all_dependencies = find_all_dependencies(USERNAME, single_repo, DEPENDENCY_FILE)

#     write_dependencies_to_file(all_dependencies, single_repo)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='Dependency Checker')
    sub_parsers = parser.add_subparsers(dest='subcommand', title='Subcommands')
    for op_name, op_spec in operations.subcommands.items():
        subcommand_parser = sub_parsers.add_parser(op_name, help=op_spec['help'])
        for param in op_spec['params']:
            subcommand_parser.add_argument(param['name'])
        for option in op_spec['options']:
            subcommand_parser.add_argument(option['short'], option['long'])
    cli_args = vars(parser.parse_args())
    if cli_args['subcommand']:
         operations.subcommands[cli_args['subcommand']]['runner'](cli_args)
    print(cli_args)

