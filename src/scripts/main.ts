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

export const main = async (org: string): Promise<void> => {
    try {
        const data = { } as OrgData;

        data[REPOS_KEY] = setReposData(await getData("getRepos", `${GIT_BASE_URL}/${org}/repos`) as GitHubRepos[]);
        data[MEMBERS_KEY] = setMembersData(await getData("getMembers", `${GIT_BASE_URL}/${org}/members`) as GitHubMembers[]);
        data[TEAMS_KEY] = await setTeamsData(await getData("getTeams", `${GIT_BASE_URL}/${org}/teams`) as GitHubTeams[]);

        setTeamsMembersReposInnerData(data);

        await saveToFile(REPOS_FILE_PATH, data);
    } catch (error: any) {
        console.error(`Error: ${error}`);
    }
};
