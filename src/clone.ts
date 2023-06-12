import {
    cloneRepos
} from "./utils/fs.js";

/* eslint-disable */
(async (): Promise<void> => {
    try {
        console.log(`This script will likely take a few hours to complete.`);
        cloneRepos();
    } catch (error: any) {
        console.error(`Error: ${error.message}`)
    }
})();
