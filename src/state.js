import {
    checkFileExists,
    saveToFile
} from "./utils/fs.js";

import {
    REPOS_DIRECTORY_PATH,
    STATE_DEPENDENCIES,
    STATE_FILE_PATH
} from "./config/index.js";

(async () => {
    try {
        checkFileExists(REPOS_DIRECTORY_PATH);

        await saveToFile(STATE_FILE_PATH, STATE_DEPENDENCIES);
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
})();