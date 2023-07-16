import { getGitOrgData, setTeamsData } from "../utils/index";
import { saveToFile } from "../utils/fs";
import { WhatEnum } from "../types/config";
import {
    REPOS_FILE_PATH,
    ORG_DATA,
    TEAMS_FILE_PATH,
    TEAMS_DATA
} from "../config/index";

export const main = async (org: string): Promise<void> => {
    try {
        for (const getWhat of Object.keys(ORG_DATA)) {
            await getGitOrgData(getWhat as WhatEnum, org);
        }
        await setTeamsData();

        await saveToFile(REPOS_FILE_PATH, ORG_DATA);
        await saveToFile(TEAMS_FILE_PATH, TEAMS_DATA);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
