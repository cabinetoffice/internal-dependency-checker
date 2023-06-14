#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { main } from "./scripts/main.js";
import { clone } from "./scripts/clone.js";
import { state } from "./scripts/state.js";

const cliArgs = yargs(hideBin(process.argv));

cliArgs.command('main <ORG>', 'Generating a list of repositories on a repos info file.', () => {}, (argv) => {
    (argv.ORG && process.env.GITHUB_KEY)
        ? main(argv.ORG as string)
        : console.error('ORG and/or GITHUB_KEY are missing!');
});

cliArgs.command('clone', 'Cloning repositories listed on repos info file.', () => {}, () => {
    clone();
});

cliArgs.command('state', 'Generating state dependencies and state vulnerabilities files.', () => {}, () => {
    state();
});

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
    .demandCommand().recommendCommands().strict()
    .argv;

