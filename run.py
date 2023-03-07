#!/usr/bin/env python3

import argparse
import operations

if __name__ == '__main__':
    parser = argparse.ArgumentParser(prog='Dependency Checker')
    sub_parsers = parser.add_subparsers(dest='subcommand', title='Subcommands')
    for op_name, op_spec in operations.subcommands.items():
        subcommand_parser = sub_parsers.add_parser(op_name, help=op_spec['help'])
        for param in op_spec['params']:
            subcommand_parser.add_argument(param['name'])
        for option in op_spec['options']:
            subcommand_parser.add_argument(option['short'], option['long'], default=None)
    cli_args = vars(parser.parse_args())
    # breakpoint()
    if cli_args['subcommand']:
         operations.subcommands[cli_args['subcommand']]['runner'](cli_args)
    print(cli_args)

