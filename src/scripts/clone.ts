import { cloneRepos } from "../utils/fs.js";

export const clone = async (): Promise<void> => {
    try {
        console.log(`This script will likely take a few hours to complete.`);
        await cloneRepos();
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
