import {
    getGitOrgData
} from "./utils/index.js";

import {
    saveToFile
} from "./utils/fs.js";

import {
    REPOS_FILE_PATH,
    ORGANIZATION,
    GITHUB_KEY,
    ORG_DATA
} from "./config/index.js";

/* eslint-disable */
(async () => {

    if (!ORGANIZATION) {
        console.error(`GitHub organization is missing`);
    }

    if (!GITHUB_KEY) {
        console.error(`Access Token/Github key is missing`);
    }

    if (ORGANIZATION && GITHUB_KEY) {
        try {
            for (const getWhat of Object.keys(ORG_DATA)) {
                await getGitOrgData(getWhat);
            }
            await saveToFile(REPOS_FILE_PATH, ORG_DATA);
        } catch (error) {
            console.error(`Error: ${error.message}`)
        }
    }

})();
