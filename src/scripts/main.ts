import { saveToFile } from "../utils/fs";
import {
    REPOS_FILE_PATH,
    ORG_DATA
} from "../config/index";
import {
    getOrgData,
    getPerTeamData,
    setOrgData,
    setTeamsData
} from "../utils/index";
import { getTeamsData } from "../service/github";

export const main = async (org: string): Promise<void> => {
    try {
        await getOrgData(org);

        // Reduce complexity of getOrgData and setOrgData by refactoring data getting and setting of repos, teams and names into their own functions. Store output of api-sdk response in variables to remove need to use TMP_DATA

        const teams = await getTeamsData(`https://api.github.com/orgs/${org}/teams`);
        setTeamsData(teams);

        await getPerTeamData();

        setOrgData();

        await saveToFile(REPOS_FILE_PATH, ORG_DATA);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
