import { writeFile, readFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

import { RepoList, JsonData } from '../types/utils.js';

import {
    REPOS_KEY,
    REPOS_DIRECTORY_PATH,
    REPOS_FILE_PATH,
    FILES_NAME,
    FILES_BY_EXTENSIONS,
    EXCLUDE_SUBDIRECTORY,
    REPOS_SUB_DIRECTORY_PATH,
    REPOS_LIST_FILE_PATH
} from "../config/index.js";

import { exec_command } from "./exec.js";
import { updateStateFile, setTimeOut } from "./index.js";

// ************************************************************ //

export const cloneRepos = async (): Promise<void> => {
    try {
        const data = await readFile(REPOS_FILE_PATH, 'utf8');
        const jsonData: JsonData = JSON.parse(data);
        const jsonDataLength = jsonData[REPOS_KEY].length;

        let index = 1;
        const repoList: RepoList = { [REPOS_KEY]: {} };

        for (const element of jsonData[REPOS_KEY]) {
            const destPath = `${REPOS_DIRECTORY_PATH}/${element.full_name}`;
            const repo_path = `${REPOS_SUB_DIRECTORY_PATH}/${element.full_name}`;
            const file_name = `${REPOS_SUB_DIRECTORY_PATH}__${element.full_name.replace('/', '__')}`;
            repoList[REPOS_KEY][file_name] = { repo_path, file_name };

            await exec_command(`git clone ${element.clone_url} ${destPath}`, index++, jsonDataLength);
            await setTimeOut();
        }
        await saveToFile(REPOS_LIST_FILE_PATH, repoList);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};

// ************************************************************ //

export const saveToFile = async (fileName: string, data: any): Promise<void> => {
    try {
        await writeFile(fileName, JSON.stringify(data));
        console.log(`Saved data to ${fileName}.`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};

// ************************************************************ //

export const checkFileExists = (directoryPath: string): void => {
    const files = fs.readdirSync(directoryPath, { withFileTypes: true });
    for (const file of files) {
        const fileName = file.name;
        const filePath = path.join(directoryPath, fileName);
        const fileExtension = path.extname(fileName);

        if (file.isFile() && (FILES_NAME.indexOf(fileName) !== -1 || FILES_BY_EXTENSIONS.indexOf(fileExtension) !== -1)) {
            updateStateFile(filePath, fileName, fileExtension);
        }

        if (file.isDirectory() && EXCLUDE_SUBDIRECTORY.indexOf(fileName) === -1) {
            checkFileExists(filePath);
        }
    }
};
