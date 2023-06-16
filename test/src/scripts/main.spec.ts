jest.mock('../../../src/utils/index');
jest.mock('../../../src/utils/fs');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import { main } from "../../../src/scripts/main";
import { saveToFile } from "../../../src/utils/fs";
import { getGitOrgData } from "../../../src/utils/index";

import { MOCK_ORGANIZATION } from '../../mock/repos_info';

const spyConsoleError = jest.spyOn(console, 'error');

const mockGetGitOrgData = getGitOrgData as jest.Mock;
const mockSaveToFile = saveToFile as jest.Mock;

describe("Main tests suites", () => {

    beforeEach(() => {
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should call the mockGetGitOrgData and saveToFile functions", async () => {
        mockGetGitOrgData.mockReturnValueOnce(() => Promise.resolve({}));
        mockSaveToFile.mockReturnValueOnce(() => Promise.resolve({}));

        await main(MOCK_ORGANIZATION);

        expect(mockGetGitOrgData).toHaveBeenCalledTimes(3);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledTimes(0);
    });

    test("should call the saveToFile function and catch the saving data to file error", async () => {
        const errMsg = "Error while saving data to file!";
        mockGetGitOrgData.mockReturnValueOnce(() => Promise.resolve({}));
        mockSaveToFile.mockRejectedValueOnce(new Error(errMsg) as never);

        await main(MOCK_ORGANIZATION);

        expect(mockGetGitOrgData).toHaveBeenCalledTimes(3);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });
});
