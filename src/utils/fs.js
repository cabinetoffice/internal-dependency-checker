import { writeFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

import {
    REPOS_DIRECTORY_PATH,
    REPOS_FILE_PATH,
    CLONE_TIMEOUT,
    FILES_NAME,
    FILES_BY_EXTENSIONS,
    EXCLUDE_SUBDIRECTORY
} from "../config/index.js";

import { exec_command } from "./exec.js";
import { updateStateFile } from "./index.js";

// ************************************************************ //

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

// ************************************************************ //

export const saveToFile = async (fileName, data) => {
    await writeFile(fileName, JSON.stringify(data))
        .then(() => console.log(`Saved data to ${fileName}.`))
        .catch(err => console.error(`Error while saving data to ${fileName}: ${err.message}`));
}

// ************************************************************ //

export const checkFileExists = (directoryPath) => {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const fileExtension = path.extname(file);
        const stats = fs.statSync(filePath);

        if (stats.isFile() && (FILES_NAME.indexOf(file) != -1 || FILES_BY_EXTENSIONS.indexOf(fileExtension) != -1)) {
            updateStateFile(filePath, file, fileExtension);
        }

        if (stats.isDirectory() && EXCLUDE_SUBDIRECTORY.indexOf(file) == -1) {
            checkFileExists(filePath);
        }
    }
};
