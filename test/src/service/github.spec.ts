import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { getTeamsData } from "../../../src/service/github";
import { MOCK_GET_TEAMS_API_SDK_RESPONSE } from "../../mock/repos_info";
import { API_CLIENT } from "../../../src/config";

jest.mock("@co-digital/api-sdk", () => ({
    createOAuthApiClient: jest.fn(() => ({
        gitHub: {
            getTeams: jest.fn()
        },
    })),
}));

const spyConsoleError = jest.spyOn(console, 'error');
const spyConsoleLog = jest.spyOn(console, 'log');

describe("getTeamsData(...)", () => {

    beforeEach(() => {
        spyConsoleLog.mockImplementation(() => {/**/});
        spyConsoleError.mockImplementation(() => {/**/});
        jest.resetAllMocks();
    });

    test('should return value should be empty if no data fetched', async () => {
        (API_CLIENT.gitHub.getTeams as jest.Mock<any>).mockResolvedValue({});

        const teams = await getTeamsData('');

        expect(spyConsoleLog).toHaveBeenCalledTimes(0);
        expect(teams).toEqual([]);
    });

    test('should return resource from getTeams API SDK response if data fetched', async () => {
        (API_CLIENT.gitHub.getTeams as jest.Mock<any>).mockResolvedValue(MOCK_GET_TEAMS_API_SDK_RESPONSE);

        const teams = await getTeamsData('');

        expect(spyConsoleLog).toHaveBeenCalledTimes(1);
        expect(teams).toEqual(MOCK_GET_TEAMS_API_SDK_RESPONSE.resource);
    });

    test('should only call getTeams API SDK response once if length of data fetched is not 100', async () => {
        (API_CLIENT.gitHub.getTeams as jest.Mock<any>).mockResolvedValue(MOCK_GET_TEAMS_API_SDK_RESPONSE);

        await getTeamsData('');

        expect(API_CLIENT.gitHub.getTeams).toHaveBeenCalledTimes(1);
    });

    test('should catch a rejected promise call', async () => {
        (API_CLIENT.gitHub.getTeams as jest.Mock<any>).mockRejectedValue([]);

        const teams = await getTeamsData('');

        expect(spyConsoleError).toHaveBeenCalledTimes(1);
        expect(teams).toEqual([]);
    });
});
