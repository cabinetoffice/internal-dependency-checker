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

export const main = async (org: string): Promise<void> => {
    try {
        await getOrgData(org);
        await getTeamsData();

        setOrgData();

        await saveToFile(REPOS_FILE_PATH, ORG_DATA);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
