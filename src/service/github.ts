import { GitHubTeams } from "@co-digital/api-sdk/lib/api-sdk/github/type";
import { API_CLIENT, PER_PAGE } from "../config/index";
import { ApiResponse } from "@co-digital/api-sdk";

export const getTeamsData = async (teamUrl: string, teams: GitHubTeams[] = [], page = 1): Promise<GitHubTeams[]> => {
    try {
        const url = `${teamUrl}?page=${page}&per_page=${PER_PAGE}`;
        const resp = await API_CLIENT.gitHub.getTeams(url) as ApiResponse<GitHubTeams[]>;
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
