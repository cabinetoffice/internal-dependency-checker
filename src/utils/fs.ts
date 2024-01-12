import { writeFile, readFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

import { OrgData, RepoDetails } from '../types/config';

import {
    REPOS_DIRECTORY_PATH,
    REPOS_FILE_PATH,
    FILES_NAME,
    FILES_BY_EXTENSIONS,
    EXCLUDE_SUBDIRECTORY,
    REPOS_SUB_DIRECTORY_PATH,
    REPOS_LIST,
    REPOS_KEY
} from "../config/index";

import { exec_command } from "./exec";
import { updateStateFile, setTimeOut } from "./index";

import { log } from './logger';

// ************************************************************ //

export const cloneRepos = async (): Promise<void> => {
    try {
        const data = await readFile(REPOS_FILE_PATH, 'utf8');
        const jsonData: OrgData = JSON.parse(data);

        let index = 1;
        const reposData = jsonData[REPOS_KEY];
        const reposDataLength = reposData.list.length;

        for (const repoName of reposData.list) {
            const repo = reposData.details[repoName] as RepoDetails;
            const destPath = `${REPOS_DIRECTORY_PATH}/${repo.full_name}`;
            const repo_path = `${REPOS_SUB_DIRECTORY_PATH}/${repo.full_name}`;
            const file_name = `${REPOS_SUB_DIRECTORY_PATH}__${repo.full_name.replace('/', '__')}`;
            REPOS_LIST[REPOS_KEY][file_name] = { repo_path, file_name };

            await exec_command(`git clone ${repo.html_url}.git ${destPath}`, index++, reposDataLength);
            await setTimeOut();
        }
    } catch (error: any) {
        log.error(`Error: ${error.message}`);
    }
};

// ************************************************************ //

export const saveToFile = async (fileName: string, data: any): Promise<void> => {
    try {
        await writeFile(fileName, JSON.stringify(data));
        log.info(`Saved data to ${fileName}.`);
    } catch (error: any) {
        log.error(`Error: ${error.message}`);
    }
};

// ************************************************************ //

export const checkFileExists = (directoryPath: string): void => {
    try {
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
    } catch (error: any) {
        log.error(`Error: ${error.message}`);
    }
};
