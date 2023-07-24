jest.mock('../../../src/utils/index');
jest.mock('../../../src/utils/fs');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import { main } from "../../../src/scripts/main";
import { saveToFile } from "../../../src/utils/fs";
import { getGitOrgData, setTeamsData } from "../../../src/utils/index";

import { MOCK_ORGANIZATION } from '../../mock/repos_info';
import { REPOS_FILE_PATH, TEAMS_FILE_PATH } from '../../../src/config';

const spyConsoleError = jest.spyOn(console, 'error');

const mockGetGitOrgData = getGitOrgData as jest.Mock;
const mockSetTeamsData = setTeamsData as jest.Mock;
const mockSaveToFile = saveToFile as jest.Mock;

describe("Main tests suites", () => {

    beforeEach(() => {
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should call getGitOrgData, setTeamsData and saveToFile functions", async () => {

        await main(MOCK_ORGANIZATION);

        expect(mockGetGitOrgData).toHaveBeenCalledTimes(3);
        expect(mockSetTeamsData).toHaveBeenCalledTimes(1);

        expect(mockSaveToFile).toHaveBeenCalledTimes(2);
        expect(mockSaveToFile).toHaveBeenCalledWith(REPOS_FILE_PATH, expect.anything());
        expect(mockSaveToFile).toHaveBeenCalledWith(TEAMS_FILE_PATH, expect.anything());

        expect(spyConsoleError).toHaveBeenCalledTimes(0);
    });

    test("should call the saveToFile function and catch the saving data to file error", async () => {
        const errMsg = "Error while saving data to file!";
        mockSaveToFile.mockRejectedValueOnce(new Error(errMsg) as never);

        await main(MOCK_ORGANIZATION);

        expect(mockGetGitOrgData).toHaveBeenCalledTimes(3);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });
});
