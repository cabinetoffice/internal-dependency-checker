import { saveToFile } from "../utils/fs";
import {
    REPOS_FILE_PATH,
    ORG_DATA
} from "../config/index";
import {
    getPerTeamData,
    setOrgData,
    setTeamsData,
    setMembersData,
    setReposData,
} from "../utils/index";
import { getTeamsData, getMembersData, getReposData } from "../service/github";

export const main = async (org: string): Promise<void> => {
    try {

        const teams = await getTeamsData(`https://api.github.com/orgs/${org}/teams`);
        const members = await getMembersData(`https://api.github.com/orgs/${org}/members`);
        const repos = await getReposData(`https://api.github.com/orgs/${org}/repos`);

        setTeamsData(teams);
        setMembersData(members);
        setReposData(repos);

        await getPerTeamData();

        setOrgData();

        await saveToFile(REPOS_FILE_PATH, ORG_DATA);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
