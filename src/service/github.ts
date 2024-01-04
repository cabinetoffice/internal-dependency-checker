import { GitHubTeams, GitHubMembers, GitHubRepos, GitHubMembersPerTeam, GitHubReposPerTeam } from "@co-digital/api-sdk/lib/api-sdk/github/type";
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

export const getReposData = async (reposUrl: string, repos: GitHubRepos[] = [], page = 1): Promise<GitHubRepos[]> => {
    try {
        const url = `${reposUrl}?page=${page}&per_page=${PER_PAGE}`;
        const resp = await client.gitHub.getRepos(url) as ApiResponse<GitHubRepos[]>;
        if (resp.resource) {
            repos = [...repos, ...resp.resource];
            console.log(`${url}, page ${page}, retrieved ${resp.resource.length}`);

            if (resp.resource.length === PER_PAGE) {
                return await getReposData(reposUrl, repos, page + 1);
            }
        }
        return repos;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        return [];
    }
};

export const getMembersPerTeamData = async (membersPerTeamUrl: string, membersPerTeam: GitHubMembersPerTeam[] = [], page = 1): Promise<GitHubMembersPerTeam[]> => {
    try {
        const url = `${membersPerTeamUrl}?page=${page}&per_page=${PER_PAGE}`;
        const resp = await client.gitHub.getMembersPerTeam(url) as ApiResponse<GitHubMembersPerTeam[]>;
        if (resp.resource) {
            membersPerTeam = [...membersPerTeam, ...resp.resource];
            console.log(`${url}, page ${page}, retrieved ${resp.resource.length}`);

            if (resp.resource.length === PER_PAGE) {
                return await getMembersPerTeamData(membersPerTeamUrl, membersPerTeam, page + 1);
            }
        }
        return membersPerTeam;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        return [];
    }
};

export const getReposPerTeamData = async (reposPerTeamUrl: string, reposPerTeam: GitHubReposPerTeam[] = [], page = 1): Promise<GitHubReposPerTeam[]> => {
    try {
        const url = `${reposPerTeamUrl}?page=${page}&per_page=${PER_PAGE}`;
        const resp = await client.gitHub.getReposPerTeam(url) as ApiResponse<GitHubReposPerTeam[]>;
        if (resp.resource) {
            reposPerTeam = [...reposPerTeam, ...resp.resource];
            console.log(`${url}, page ${page}, retrieved ${resp.resource.length}`);
            if (resp.resource.length === PER_PAGE) {
                return await getReposPerTeamData(reposPerTeamUrl, reposPerTeam, page + 1);
            }
        }
        return reposPerTeam;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        return [];
    }
};
