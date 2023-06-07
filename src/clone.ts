import {
    cloneRepos
} from "./utils/fs.js";

/* eslint-disable */
(async () => {
    try {
        console.log(`This script will likely take a few hours to complete.`);
        cloneRepos();
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
})();
