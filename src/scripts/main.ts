import { getGitOrgData } from "../utils/index";
import { saveToFile } from "../utils/fs";
import { WhatEnum } from "../types/config";
import {
    REPOS_FILE_PATH,
    ORG_DATA
} from "../config/index";

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
