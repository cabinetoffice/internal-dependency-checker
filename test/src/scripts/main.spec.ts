jest.mock('../../../src/utils/index');
jest.mock('../../../src/utils/fs');
jest.mock('../../../src/service/github');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import { REPOS_FILE_PATH } from '../../../src/config';
import {
    MOCK_ORGANIZATION,
    MOCK_ORG_TEAMS,
    MOCK_ORG_MEMBERS,
    MOCK_ORG_REPOS,
    BASE_URL
} from '../../mock/repos_info';
import {
    setTeamsData,
    setMembersData,
    setReposData,
    setTeamsMembersReposInnerData
} from "../../../src/utils/index";

import { getData } from '../../../src/service/github';
import { saveToFile } from "../../../src/utils/fs";
import { main } from "../../../src/scripts/main";

const spyConsoleError = jest.spyOn(console, 'error');

const mockSetTeamsData = setTeamsData as jest.Mock;
const mockSetMembersData = setMembersData as jest.Mock;
const mockSetReposData = setReposData as jest.Mock;

const mockGetData = getData as jest.Mock;

const mockSaveToFile = saveToFile as jest.Mock;
const mockSetTeamsMembersReposInnerData = setTeamsMembersReposInnerData as jest.Mock;

describe("Main tests suites", () => {

    beforeEach(() => {
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should call github data getters/setters and saveToFile functions", async () => {

        const MOCK_ORG_DATA = { ...MOCK_ORG_REPOS, ...MOCK_ORG_MEMBERS, ...MOCK_ORG_TEAMS };

        mockSetReposData.mockReturnValueOnce(MOCK_ORG_REPOS.repos);
        mockSetMembersData.mockReturnValueOnce(MOCK_ORG_MEMBERS.members);
        mockSetTeamsData.mockReturnValueOnce(MOCK_ORG_TEAMS.teams);

        await main(MOCK_ORGANIZATION);

        expect(mockGetData).toHaveBeenCalledTimes(3);
        expect(mockGetData).toHaveBeenCalledWith("getRepos", `${BASE_URL}/repos`);
        expect(mockGetData).toHaveBeenCalledWith("getMembers", `${BASE_URL}/members`);
        expect(mockGetData).toHaveBeenCalledWith("getTeams", `${BASE_URL}/teams`);

        expect(mockSetReposData).toBeCalledTimes(1);
        expect(mockSetMembersData).toBeCalledTimes(1);
        expect(mockSetTeamsData).toHaveBeenCalledTimes(1);

        expect(mockSetTeamsMembersReposInnerData).toHaveBeenCalledTimes(1);
        expect(mockSetTeamsMembersReposInnerData).toHaveBeenCalledWith(MOCK_ORG_DATA);

        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledWith(REPOS_FILE_PATH, MOCK_ORG_DATA);

        expect(spyConsoleError).toHaveBeenCalledTimes(0);
    });

    test("should call the saveToFile function and catch the saving data to file error", async () => {
        const errMsg = "Error while saving data to file!";
        mockSaveToFile.mockRejectedValueOnce(new Error(errMsg) as never);

        await main(MOCK_ORGANIZATION);

        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });
});
