import { getGitOrgData } from "../utils/index.js";
import { saveToFile } from "../utils/fs.js";
import { WhatEnum } from "../types/config.js";
import {
    REPOS_FILE_PATH,
    ORG_DATA
} from "../config/index.js";

export const main = async (org: string): Promise<void> => {
    try {
        for (const getWhat of Object.keys(ORG_DATA)) {
            await getGitOrgData(getWhat as WhatEnum, org);
        }
        await saveToFile(REPOS_FILE_PATH, ORG_DATA);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
