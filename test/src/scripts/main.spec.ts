jest.mock('../../../src/utils/index');
jest.mock('../../../src/utils/fs');
jest.mock('../../../src/service/github');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import { main } from "../../../src/scripts/main";
import { saveToFile } from "../../../src/utils/fs";
import { getPerTeamData, setOrgData, setTeamsData, setMembersData, setReposData, setPerTeamData } from "../../../src/utils/index";

import { getTeamsData, getMembersData, getReposData } from '../../../src/service/github';

import { MOCK_ORGANIZATION, MOCK_REPOS_TEAMS_DATA, MOCK_MEMBERS_TEAMS_DATA, MOCK_REPOS_REPO_DATA, GET_PER_TEAM_DATA_MOCK } from '../../mock/repos_info';
import { REPOS_FILE_PATH } from '../../../src/config';

const spyConsoleError = jest.spyOn(console, 'error');

const mockGetTeamsData = (getTeamsData as jest.Mock<any>).mockResolvedValue(MOCK_REPOS_TEAMS_DATA);
const mockSetTeamsData = setTeamsData as jest.Mock;
const mockGetPerTeamData = (getPerTeamData as jest.Mock<any>).mockResolvedValue(GET_PER_TEAM_DATA_MOCK);
const mockSetPerTeamData = setPerTeamData as jest.Mock;
const mockSetMembersData = setMembersData as jest.Mock;
const mockGetMembersData = (getMembersData as jest.Mock<any>).mockResolvedValue(MOCK_MEMBERS_TEAMS_DATA);
const mockSetReposData = setReposData as jest.Mock;
const mockGetReposData = (getReposData as jest.Mock<any>).mockResolvedValue(MOCK_REPOS_REPO_DATA);
const mockSaveToFile = saveToFile as jest.Mock;
const mockSetOrgData = setOrgData as jest.Mock;

describe("Main tests suites", () => {

    beforeEach(() => {
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should call github data getters/setters and saveToFile functions", async () => {

        await main(MOCK_ORGANIZATION);

        expect(mockGetTeamsData).toHaveBeenCalledTimes(1);
        expect(mockGetMembersData).toBeCalledTimes(1);
        expect(mockGetReposData).toBeCalledTimes(1);

        expect(mockSetTeamsData).toHaveBeenCalledTimes(1);
        expect(mockSetTeamsData).toHaveBeenCalledWith(MOCK_REPOS_TEAMS_DATA);
        expect(mockSetMembersData).toBeCalledTimes(1);
        expect(mockSetMembersData).toBeCalledWith(MOCK_MEMBERS_TEAMS_DATA);
        expect(mockSetReposData).toBeCalledTimes(1);
        expect(mockSetReposData).toBeCalledWith(MOCK_REPOS_REPO_DATA);

        expect(mockGetPerTeamData).toHaveBeenCalledTimes(1);

        expect(mockSetPerTeamData).toHaveBeenCalledTimes(1);
        expect(mockSetPerTeamData).toHaveBeenCalledWith(GET_PER_TEAM_DATA_MOCK);

        expect(mockSetOrgData).toHaveBeenCalledTimes(1);

        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledWith(REPOS_FILE_PATH, expect.anything());

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
