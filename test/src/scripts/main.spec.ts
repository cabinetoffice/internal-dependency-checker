jest.mock('../../../src/utils/index');
jest.mock('../../../src/utils/fs');
jest.mock('../../../src/utils/logger', () => ({
    log: {
        error: jest.fn()
    }
}));

import { describe, expect, test, jest, afterEach } from '@jest/globals';

import { main } from "../../../src/scripts/main";
import { saveToFile } from "../../../src/utils/fs";
import { getOrgData, getTeamsData, setOrgData } from "../../../src/utils/index";

import { MOCK_ORGANIZATION } from '../../mock/repos_info';
import { REPOS_FILE_PATH } from '../../../src/config';

import { log } from '../../../src/utils/logger';

const mockLogError = log.error as jest.Mock;

const mockGetOrgData = getOrgData as jest.Mock;
const mockGetTeamsData = getTeamsData as jest.Mock;
const mockSaveToFile = saveToFile as jest.Mock;
const mockSetOrgData = setOrgData as jest.Mock;

describe("Main tests suites", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should call getOrgData, getTeamsData and saveToFile functions", async () => {

        await main(MOCK_ORGANIZATION);

        expect(mockGetOrgData).toHaveBeenCalledTimes(1);
        expect(mockGetTeamsData).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(mockSetOrgData).toHaveBeenCalledTimes(1);

        expect(mockSaveToFile).toHaveBeenCalledWith(REPOS_FILE_PATH, expect.anything());

        expect(mockLogError).toHaveBeenCalledTimes(0);
    });

    test("should call the saveToFile function and catch the saving data to file error", async () => {
        const errMsg = "Error while saving data to file!";
        mockSaveToFile.mockRejectedValueOnce(new Error(errMsg) as never);

        await main(MOCK_ORGANIZATION);

        expect(mockGetOrgData).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(mockLogError).toHaveBeenCalledTimes(1);
        expect(mockLogError).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });
});
