import { cloneRepos, saveToFile } from "../utils/fs";
import { REPOS_LIST, REPOS_LIST_FILE_PATH } from "../config/index";

export const clone = async (): Promise<void> => {
    try {
        console.log(`This script will likely take a few hours to complete.`);
        await cloneRepos();

        await saveToFile(REPOS_LIST_FILE_PATH, REPOS_LIST);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
