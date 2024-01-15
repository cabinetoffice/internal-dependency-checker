jest.mock("@co-digital/api-sdk", () => ({
    createOAuthApiClient: jest.fn(() => ({
        gitHub: {
            getTeams: jest.fn(),
            getMembers: jest.fn(),
            getRepos: jest.fn(),
            getMembersPerTeam: jest.fn(),
            getReposPerTeam: jest.fn()
        },
    })),
}));
jest.mock('../../../src/utils/logger', () => ({
    log: {
        info: jest.fn(),
        error: jest.fn()
    }
}));

import { jest, describe, afterEach, test, expect } from '@jest/globals';

import {
    MOCK_GET_TEAMS_API_SDK_RESPONSE,
    MOCK_GET_MEMBERS_API_SDK_RESPONSE,
    MOCK_GET_REPOS_API_SDK_RESPONSE,
    MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE,
    MOCK_GET_REPOS_PER_TEAM_API_SDK_RESPONSE
} from "../../mock/repos_info";

import { getData } from "../../../src/service/github";
import { client } from "../../../src/service/api";
import { log } from "../../../src/utils/logger";

const mockGetTeams = client.gitHub.getTeams as jest.Mock<any>;
const mockGetMembers = client.gitHub.getMembers as jest.Mock<any>;
const mockGetRepos = client.gitHub.getRepos as jest.Mock<any>;
const mockGetMembersPerTeam = client.gitHub.getMembersPerTeam as jest.Mock<any>;
const mockGetReposPerTeam = client.gitHub.getReposPerTeam as jest.Mock<any>;

const mockLogError = log.error as jest.Mock;
const mockLogInfo = log.info as jest.Mock;

describe("github service test suite", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getTeamsData tests", () => {
        test('should return value should be empty if no data fetched', async () => {
            mockGetTeams.mockResolvedValue({});

            const teams = await getData('getTeams', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(0);
            expect(teams).toEqual([]);
        });

        test('should return resource from getTeams API SDK response if data fetched', async () => {
            mockGetTeams.mockResolvedValue(MOCK_GET_TEAMS_API_SDK_RESPONSE);

            const teams = await getData('getTeams', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(1);
            expect(teams).toEqual(MOCK_GET_TEAMS_API_SDK_RESPONSE.resource);
        });

        test('should only call getTeams API SDK response once if length of data fetched is not 100', async () => {
            mockGetTeams.mockResolvedValue(MOCK_GET_TEAMS_API_SDK_RESPONSE);

            await getData('getTeams', "");

            expect(client.gitHub.getTeams).toHaveBeenCalledTimes(1);
        });

        test('should catch a rejected promise call', async () => {
            mockGetTeams.mockRejectedValue([]);

            const teams = await getData('getTeams', "");

            expect(mockLogError).toHaveBeenCalledTimes(1);
            expect(teams).toEqual([]);
        });

    });

    describe("getMembersData tests", () => {
        test('should return value should be empty if no data fetched', async () => {
            mockGetMembers.mockResolvedValue({});

            const members = await getData('getMembers', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(0);
            expect(members).toEqual([]);
        });

        test('should return resource from getMembers API SDK response if data fetched', async () => {
            mockGetMembers.mockResolvedValue(MOCK_GET_MEMBERS_API_SDK_RESPONSE);

            const members = await getData('getMembers', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(1);
            expect(members).toEqual(MOCK_GET_MEMBERS_API_SDK_RESPONSE.resource);
        });

        test('should only call getMembers API SDK response once if length of data fetched is not 100', async () => {
            mockGetMembers.mockResolvedValue(MOCK_GET_MEMBERS_API_SDK_RESPONSE);

            await getData('getMembers', "");

            expect(client.gitHub.getMembers).toHaveBeenCalledTimes(1);
        });

        test('should catch a rejected promise call', async () => {
            mockGetMembers.mockRejectedValue([]);

            const members = await getData('getMembers', "");

            expect(mockLogError).toHaveBeenCalledTimes(1);
            expect(members).toEqual([]);
        });

    });

    describe("getReposData tests", () => {
        test('should return value should be empty if no data fetched', async () => {
            mockGetRepos.mockResolvedValue({});

            const repos = await getData('getRepos', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(0);
            expect(repos).toEqual([]);
        });

        test('should return resource from getRepos API SDK response if data fetched', async () => {
            mockGetRepos.mockResolvedValue(MOCK_GET_REPOS_API_SDK_RESPONSE);

            const repos = await getData('getRepos', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(1);
            expect(repos).toEqual(MOCK_GET_REPOS_API_SDK_RESPONSE.resource);
        });

        test('should only call getRepos API SDK response once if length of data fetched is not 100', async () => {
            mockGetRepos.mockResolvedValue(MOCK_GET_REPOS_API_SDK_RESPONSE);

            await getData('getRepos', "");

            expect(client.gitHub.getRepos).toHaveBeenCalledTimes(1);
        });

        test('should call getRepos API SDK twice', async () => {
            const mockResourceLength = { resource: "X".repeat(100) };
            mockGetRepos.mockResolvedValueOnce(mockResourceLength);
            mockGetRepos.mockResolvedValueOnce(MOCK_GET_REPOS_API_SDK_RESPONSE);

            await getData('getRepos', "");

            expect(client.gitHub.getRepos).toHaveBeenCalledTimes(2);
        });

        test('should catch a rejected promise call', async () => {
            mockGetRepos.mockRejectedValue([]);

            const repos = await getData('getRepos', "");

            expect(mockLogError).toHaveBeenCalledTimes(1);
            expect(repos).toEqual([]);
        });
    });

    describe("getMembersPerTeam tests", () => {
        test('should return value should be empty if no data fetched', async () => {
            mockGetMembersPerTeam.mockResolvedValue({});

            const membersPerTeam = await getData('getMembersPerTeam', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(0);
            expect(membersPerTeam).toEqual([]);
        });

        test('should return resource from getMembersPerTeam API SDK response if data fetched', async () => {
            mockGetMembersPerTeam.mockResolvedValue(MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE);

            const membersPerTeam = await getData('getMembersPerTeam', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(1);
            expect(membersPerTeam).toEqual(MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE.resource);
        });

        test('should only call getMembersPerTeam API SDK response once if length of data fetched is not 100', async () => {
            mockGetMembersPerTeam.mockResolvedValue(MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE);

            await getData('getMembersPerTeam', "");

            expect(client.gitHub.getMembersPerTeam).toHaveBeenCalledTimes(1);
        });

        test('should catch a rejected promise call', async () => {
            mockGetMembersPerTeam.mockRejectedValue([]);

            const membersPerTeam = await getData('getMembersPerTeam', "");

            expect(mockLogError).toHaveBeenCalledTimes(1);
            expect(membersPerTeam).toEqual([]);
        });

    });

    describe("getReposPerTeam tests", () => {
        test('should return value should be empty if no data fetched', async () => {
            mockGetReposPerTeam.mockResolvedValue({});

            const reposPerTeam = await getData('getReposPerTeam', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(0);
            expect(reposPerTeam).toEqual([]);
        });

        test('should return resource from getReposPerTeam API SDK response if data fetched', async () => {
            mockGetReposPerTeam.mockResolvedValue(MOCK_GET_REPOS_PER_TEAM_API_SDK_RESPONSE);

            const reposPerTeam = await getData('getReposPerTeam', "");

            expect(mockLogInfo).toHaveBeenCalledTimes(1);
            expect(reposPerTeam).toEqual(MOCK_GET_REPOS_PER_TEAM_API_SDK_RESPONSE.resource);
        });

        test('should only call getReposPerTeam API SDK response once if length of data fetched is not 100', async () => {
            mockGetReposPerTeam.mockResolvedValue(MOCK_GET_REPOS_PER_TEAM_API_SDK_RESPONSE);

            await getData('getReposPerTeam', "");

            expect(client.gitHub.getReposPerTeam).toHaveBeenCalledTimes(1);
        });

        test('should catch a rejected promise call', async () => {
            mockGetReposPerTeam.mockRejectedValue([]);

            const reposPerTeam = await getData('getReposPerTeam', "");

            expect(mockLogError).toHaveBeenCalledTimes(1);
            expect(reposPerTeam).toEqual([]);
        });

    });

});
