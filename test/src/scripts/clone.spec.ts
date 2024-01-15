jest.mock('../../../src/utils/fs');
jest.mock('../../../src/utils/logger', () => ({
    log: {
        info: jest.fn(),
        error: jest.fn()
    }
}));

import { describe, expect, test, jest, afterEach } from '@jest/globals';

import { clone } from "../../../src/scripts/clone";
import { cloneRepos, saveToFile } from "../../../src/utils/fs";
import { REPOS_LIST_FILE_PATH } from '../../../src/config';

import { log } from '../../../src/utils/logger';

const mockLogError = log.error as jest.Mock;
const mockLogInfo = log.info as jest.Mock;

const mockCloneReposCall = cloneRepos as jest.Mock;
const mockSaveToFile = saveToFile as jest.Mock;

describe("Clone tests suites", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should call the cloneRepos function", async () => {
        await clone();

        expect(mockCloneReposCall).toHaveBeenCalledTimes(1);

        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledWith(REPOS_LIST_FILE_PATH, expect.anything());

        expect(mockLogInfo).toHaveBeenCalledTimes(1);
        expect(mockLogInfo).toHaveBeenCalledWith("This script will likely take a few hours to complete.");
        expect(mockLogError).toHaveBeenCalledTimes(0);
    });

    test("should call the cloneRepos function and catch the parsing error", async () => {
        const errMsg = "Error parsing JSON";
        mockCloneReposCall.mockRejectedValueOnce(new Error(errMsg) as never);

        await clone();

        expect(mockCloneReposCall).toHaveBeenCalledTimes(1);

        expect(mockSaveToFile).toHaveBeenCalledTimes(0);
        expect(mockLogError).toHaveBeenCalledTimes(1);
        expect(mockLogError).toHaveBeenCalledTimes(1);
        expect(mockLogError).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });

});
