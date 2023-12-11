import { GitHubTeams, GitHubMembers } from "@co-digital/api-sdk/lib/api-sdk/github/type";
import { PER_PAGE } from "../config/index";
import { ApiResponse } from "@co-digital/api-sdk";
import { client } from "./api";

export const getTeamsData = async (teamUrl: string, teams: GitHubTeams[] = [], page = 1): Promise<GitHubTeams[]> => {
    try {
        const url = `${teamUrl}?page=${page}&per_page=${PER_PAGE}`;
        const resp = await client.gitHub.getTeams(url) as ApiResponse<GitHubTeams[]>;
        if (resp.resource) {
            teams = [...teams, ...resp.resource];
            console.log(`${url}, page ${page}, retrieved ${resp.resource.length}`);

            if (resp.resource.length === PER_PAGE) {
                return await getTeamsData(teamUrl, teams, page + 1);
            }
        }
        return teams;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        return [];
    }
};

export const getMembersData = async (memberUrl: string, members: GitHubMembers[] = [], page = 1): Promise<GitHubMembers[]> => {
    try {
        const url = `${memberUrl}?page=${page}&per_page=${PER_PAGE}`;
        const resp = await client.gitHub.getMembers(url) as ApiResponse<GitHubMembers[]>;
        if (resp.resource) {
            members = [...members, ...resp.resource];
            console.log(`${url}, page ${page}, retrieved ${resp.resource.length}`);

            if (resp.resource.length === PER_PAGE) {
                return await getMembersData(memberUrl, members, page + 1);
            }
        }
        return members;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        return [];
    }

};
