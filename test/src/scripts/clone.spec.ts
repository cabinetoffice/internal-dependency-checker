jest.mock('../../../src/utils/fs');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import { clone } from "../../../src/scripts/clone";
import { cloneRepos, saveToFile } from "../../../src/utils/fs";
import { REPOS_LIST_FILE_PATH } from '../../../src/config';

const spyConsoleLog = jest.spyOn(console, 'log');
const spyConsoleError = jest.spyOn(console, 'error');

const mockCloneReposCall = cloneRepos as jest.Mock;
const mockSaveToFile = saveToFile as jest.Mock;

describe("Clone tests suites", () => {

    beforeEach(() => {
        spyConsoleLog.mockImplementation(() => {/**/});
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should call the cloneRepos function", async () => {
        await clone();

        expect(mockCloneReposCall).toHaveBeenCalledTimes(1);

        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledWith(REPOS_LIST_FILE_PATH, expect.anything());

        expect(spyConsoleLog).toHaveBeenCalledTimes(1);
        expect(spyConsoleLog).toHaveBeenCalledWith("This script will likely take a few hours to complete.");
        expect(spyConsoleError).toHaveBeenCalledTimes(0);
    });

    test("should call the cloneRepos function and catch the parsing error", async () => {
        const errMsg = "Error parsing JSON";
        mockCloneReposCall.mockRejectedValueOnce(new Error(errMsg) as never);

        await clone();

        expect(mockCloneReposCall).toHaveBeenCalledTimes(1);

        expect(mockSaveToFile).toHaveBeenCalledTimes(0);
        expect(spyConsoleLog).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });

});
