jest.mock("@co-digital/api-sdk", () => ({
    createOAuthApiClient: jest.fn(() => ({
        gitHub: {
            getTeams: jest.fn(),
            getMembers: jest.fn(),
            getRepos: jest.fn(),
            getMembersPerTeam: jest.fn()
        },
    })),
}));

import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { getTeamsData, getMembersData, getReposData, getMembersPerTeamData } from "../../../src/service/github";
import { MOCK_GET_TEAMS_API_SDK_RESPONSE, MOCK_GET_MEMBERS_API_SDK_RESPONSE, MOCK_GET_REPOS_API_SDK_RESPONSE, MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE } from "../../mock/repos_info";
import { client } from "../../../src/service/api";

const mockGetTeams = client.gitHub.getTeams as jest.Mock<any>;
const mockGetMembers = client.gitHub.getMembers as jest.Mock<any>;
const mockGetRepos = client.gitHub.getRepos as jest.Mock<any>;
const mockGetMembersPerTeam = client.gitHub.getMembersPerTeam as jest.Mock<any>;

const spyConsoleError = jest.spyOn(console, 'error');
const spyConsoleLog = jest.spyOn(console, 'log');

describe("github service test suite", () => {

    beforeEach(() => {
        spyConsoleLog.mockImplementation(() => {/**/});
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getTeamsData tests", () => {
        test('should return value should be empty if no data fetched', async () => {
            mockGetTeams.mockResolvedValue({});

            const teams = await getTeamsData('');

            expect(spyConsoleLog).toHaveBeenCalledTimes(0);
            expect(teams).toEqual([]);
        });

        test('should return resource from getTeams API SDK response if data fetched', async () => {
            mockGetTeams.mockResolvedValue(MOCK_GET_TEAMS_API_SDK_RESPONSE);

            const teams = await getTeamsData('');

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(teams).toEqual(MOCK_GET_TEAMS_API_SDK_RESPONSE.resource);
        });

        test('should only call getTeams API SDK response once if length of data fetched is not 100', async () => {
            mockGetTeams.mockResolvedValue(MOCK_GET_TEAMS_API_SDK_RESPONSE);

            await getTeamsData('');

            expect(client.gitHub.getTeams).toHaveBeenCalledTimes(1);
        });

        test('should catch a rejected promise call', async () => {
            mockGetTeams.mockRejectedValue([]);

            const teams = await getTeamsData('');

            expect(spyConsoleError).toHaveBeenCalledTimes(1);
            expect(teams).toEqual([]);
        });

    });

    describe("getMembersData tests", () => {
        test('should return value should be empty if no data fetched', async () => {
            mockGetMembers.mockResolvedValue({});

            const members = await getMembersData('');

            expect(spyConsoleLog).toHaveBeenCalledTimes(0);
            expect(members).toEqual([]);
        });

        test('should return resource from getMembers API SDK response if data fetched', async () => {
            mockGetMembers.mockResolvedValue(MOCK_GET_MEMBERS_API_SDK_RESPONSE);

            const members = await getMembersData('');

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(members).toEqual(MOCK_GET_MEMBERS_API_SDK_RESPONSE.resource);
        });

        test('should only call getMembers API SDK response once if length of data fetched is not 100', async () => {
            mockGetMembers.mockResolvedValue(MOCK_GET_MEMBERS_API_SDK_RESPONSE);

            await getMembersData('');

            expect(client.gitHub.getMembers).toHaveBeenCalledTimes(1);
        });

        test('should catch a rejected promise call', async () => {
            mockGetMembers.mockRejectedValue([]);

            const members = await getMembersData('');

            expect(spyConsoleError).toHaveBeenCalledTimes(1);
            expect(members).toEqual([]);
        });

    });
    describe("getReposData tests", () => {
        test('should return value should be empty if no data fetched', async () => {
            mockGetRepos.mockResolvedValue({});

            const repos = await getReposData('');

            expect(spyConsoleLog).toHaveBeenCalledTimes(0);
            expect(repos).toEqual([]);
        });

        test('should return resource from getRepos API SDK response if data fetched', async () => {
            mockGetRepos.mockResolvedValue(MOCK_GET_REPOS_API_SDK_RESPONSE);

            const repos = await getReposData('');

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(repos).toEqual(MOCK_GET_REPOS_API_SDK_RESPONSE.resource);
        });

        test('should only call getRepos API SDK response once if length of data fetched is not 100', async () => {
            mockGetRepos.mockResolvedValue(MOCK_GET_REPOS_API_SDK_RESPONSE);

            await getReposData('');

            expect(client.gitHub.getRepos).toHaveBeenCalledTimes(1);
        });

        test('should catch a rejected promise call', async () => {
            mockGetRepos.mockRejectedValue([]);

            const repos = await getReposData('');

            expect(spyConsoleError).toHaveBeenCalledTimes(1);
            expect(repos).toEqual([]);
        });
    });

    describe("getMembersPerTeam tests", () => {
        test('should return value should be empty if no data fetched', async () => {
            mockGetMembersPerTeam.mockResolvedValue({});

            const membersPerTeam = await getMembersPerTeamData('');

            expect(spyConsoleLog).toHaveBeenCalledTimes(0);
            expect(membersPerTeam).toEqual([]);
        });

        test('should return resource from getMembersPerTeam API SDK response if data fetched', async () => {
            mockGetMembersPerTeam.mockResolvedValue(MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE);

            const membersPerTeam = await getMembersPerTeamData('');

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(membersPerTeam).toEqual(MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE.resource);
        });

        test('should only call getMembersPerTeam API SDK response once if length of data fetched is not 100', async () => {
            mockGetMembersPerTeam.mockResolvedValue(MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE);

            await getMembersPerTeamData('');

            expect(client.gitHub.getMembersPerTeam).toHaveBeenCalledTimes(1);
        });

        test('should catch a rejected promise call', async () => {
            mockGetMembersPerTeam.mockRejectedValue([]);

            const membersPerTeam = await getMembersPerTeamData('');

            expect(spyConsoleError).toHaveBeenCalledTimes(1);
            expect(membersPerTeam).toEqual([]);
        });
        
    });

});
