import {
    checkFileExists,
    saveToFile
} from "../utils/fs";

import {
    REPOS_DIRECTORY_PATH,
    STATE_DEPENDENCIES,
    STATE_FILE_PATH
} from "../config/index";

export const state = async (): Promise<void> => {
    try {
        checkFileExists(REPOS_DIRECTORY_PATH);
        await saveToFile(STATE_FILE_PATH, STATE_DEPENDENCIES);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
