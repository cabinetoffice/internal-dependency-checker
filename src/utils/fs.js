import { writeFile } from 'node:fs/promises';
import fs from 'node:fs';

import {
    REPOS_DIRECTORY_PATH,
    REPOS_FILE_PATH,
    CLONE_TIMEOUT
} from "../config/index.js";

import { exec_command } from "./exec.js";

export const read_and_clone_repo = () => {
    fs.readFile(`./${REPOS_FILE_PATH}`, 'utf8', async (error, data) => {
        if (error) {
            console.error('Issue on reading the file:', error);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            console.log(`Started cloning first of ${jsonData['repos'].length} repos!`);
            for (const element of jsonData['repos']) {
                const destPath = `./${REPOS_DIRECTORY_PATH}/${element.full_name}`;
                await exec_command(`git clone ${element.clone_url} ${destPath}`);
                await new Promise(resolve => setTimeout(resolve, CLONE_TIMEOUT));
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
}

export const saveToFile = async (fileName, data) => {
    await writeFile(fileName, JSON.stringify(data))
        .then(() => console.log(`Saved data to ${fileName}.`))
        .catch(err => console.error(`Error while saving data to ${fileName}: ${err.message}`));
}