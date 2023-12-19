import {
    checkFileExists,
    saveToFile
} from "../utils/fs";

import {
    REPOS_DIRECTORY_PATH,
    STATE_DEPENDENCIES,
    STATE_FILE_PATH
} from "../config/index";

import { log } from "../utils/logger";

export const state = async (): Promise<void> => {
    try {
        checkFileExists(REPOS_DIRECTORY_PATH);
        await saveToFile(STATE_FILE_PATH, STATE_DEPENDENCIES);
    } catch (error: any) {
        log.error(`Error: ${error.message}`);
    }
};
