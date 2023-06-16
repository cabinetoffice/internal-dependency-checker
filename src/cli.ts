#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { main } from "./scripts/main";
import { clone } from "./scripts/clone";
import { state } from "./scripts/state";

export const mainCommand = (argv: any) => {
    console.log('Start main command!');
    (argv.ORG && process.env.GITHUB_KEY)
        ? main(argv.ORG as string)
        : console.error('ORG and/or GITHUB_KEY are missing!');
};
export const cloneCommand = () => {
    console.log('Start clone command!');
    clone();
};
export const stateCommand = () => {
    console.log('Start state command!');
    state();
};

const cliArgs = yargs(hideBin(process.argv));

cliArgs.command('main <ORG>', 'Generating a list of repositories on a repos info file.', () => {/**/}, mainCommand );
cliArgs.command('clone', 'Cloning repositories listed on repos info file.', () => {/**/}, cloneCommand );
cliArgs.command('state', 'Generating state dependencies and state vulnerabilities files.', () => {/**/}, stateCommand );
cliArgs
    .usage('Usage: ./dist/cli.js <Command> [main <ORG>|clone|state] <Options>')
    .example([
        ['./dist/cli.js main <ORG>', 'Create repositories info file'],
        ['./dist/cli.js clone', 'Clone repos'],
        ['./dist/cli.js state', 'Create state files']
    ])
    .alias('h', 'help')
    .alias('v', 'version')
    .epilog('Copyright (c) 2023 Cabinet Office - MIT License')
    .argv;
