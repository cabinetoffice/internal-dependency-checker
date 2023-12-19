#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { main } from "./scripts/main";
import { clone } from "./scripts/clone";
import { state } from "./scripts/state";

import { log } from "./utils/logger";

export const mainCommand = (argv: any) => {
    log.info('Start main command!');
    (argv.ORG && process.env.GITHUB_KEY)
        ? main(argv.ORG as string)
        : log.error('ORG and/or GITHUB_KEY are missing!');
};
export const cloneCommand = () => {
    log.info('Start clone command!');
    clone();
};
export const stateCommand = () => {
    log.info('Start state command!');
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
