import { saveToFile } from "../utils/fs";
import {
    REPOS_FILE_PATH,
    ORG_DATA
} from "../config/index";
import {
    getOrgData,
    getTeamsData,
    setOrgData
} from "../utils/index";
import { log } from "../utils/logger";

export const main = async (org: string): Promise<void> => {
    try {
        await getOrgData(org);
        await getTeamsData();

        setOrgData();

        await saveToFile(REPOS_FILE_PATH, ORG_DATA);
    } catch (error: any) {
        log.error(`Error: ${error.message}`);
    }
};
