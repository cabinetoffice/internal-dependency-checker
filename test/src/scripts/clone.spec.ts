jest.mock('../../../src/utils/fs');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import { clone } from "../../../src/scripts/clone";
import { cloneRepos } from "../../../src/utils/fs";

const spyConsoleLog = jest.spyOn(console, 'log');
const spyConsoleError = jest.spyOn(console, 'error');

const mockCloneReposCall = cloneRepos as jest.Mock;

describe("Clone tests suites", () => {

    beforeEach(() => {
        spyConsoleLog.mockImplementation(() => {/**/});
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should call the cloneRepos function", async () => {
        mockCloneReposCall.mockReturnValueOnce(() => Promise.resolve({}));

        await clone();

        expect(mockCloneReposCall).toHaveBeenCalledTimes(1);
        expect(spyConsoleLog).toHaveBeenCalledTimes(1);
        expect(spyConsoleLog).toHaveBeenCalledWith("This script will likely take a few hours to complete.");
        expect(spyConsoleError).toHaveBeenCalledTimes(0);
    });

    test("should call the cloneRepos function and catch the parsing error", async () => {
        const errMsg = "Error parsing JSON";
        mockCloneReposCall.mockRejectedValueOnce(new Error(errMsg) as never);

        await clone();

        expect(mockCloneReposCall).toHaveBeenCalledTimes(1);
        expect(spyConsoleLog).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledTimes(1);
        expect(spyConsoleError).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });

});
