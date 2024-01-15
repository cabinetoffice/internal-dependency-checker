import {
    GitHubTeams,
    GitHubMembers,
    GitHubRepos
} from "@co-digital/api-sdk/lib/api-sdk/github/type";

import { saveToFile } from "../utils/fs";
import { OrgData } from "../types/config";
import { getData } from "../service/github";
import {
    GIT_BASE_URL,
    MEMBERS_KEY,
    REPOS_FILE_PATH,
    REPOS_KEY,
    TEAMS_KEY
} from "../config/index";
import {
    setTeamsData,
    setMembersData,
    setReposData,
    setTeamsMembersReposInnerData
} from "../utils/index";
import { log } from "../utils/logger";

export const main = async (org: string): Promise<void> => {
    try {
        const orgData = { } as OrgData;

        orgData[REPOS_KEY] = setReposData(await getData<GitHubRepos>("getRepos", `${GIT_BASE_URL}/${org}/repos`));
        orgData[MEMBERS_KEY] = setMembersData(await getData<GitHubMembers>("getMembers", `${GIT_BASE_URL}/${org}/members`));
        orgData[TEAMS_KEY] = await setTeamsData(await getData<GitHubTeams>("getTeams", `${GIT_BASE_URL}/${org}/teams`));

        setTeamsMembersReposInnerData(orgData);

        await saveToFile(REPOS_FILE_PATH, orgData);
    } catch (error: any) {
        log.error(`Error: ${error.message}`);
    }
};
