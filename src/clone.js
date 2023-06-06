import {
    read_and_clone_repo,
    saveToFile
} from "./utils/fs.js";

import {
    REPOS_LIST_FILE_PATH,
    REPOS_LIST
} from "./config/index.js";

/* eslint-disable */
(async () => {
    try {
        console.log(`This script will likely take a few hours to complete, depending on the number of repositories and other factors (ratelimits ...)`);
        read_and_clone_repo();

        await saveToFile(REPOS_LIST_FILE_PATH, REPOS_LIST);
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
})();
