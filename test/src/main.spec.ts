jest.mock('../../src/utils/index');
jest.mock('../../src/utils/fs');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';
import { SpiedFunction } from 'jest-mock';

import { main } from "../../src/main";
import { saveToFile } from "../../src/utils/fs";
import { getGitOrgData } from "../../src/utils/index";

let consoleErrorMock: SpiedFunction;
let mockGetGitOrgData = getGitOrgData as jest.Mock;
let mockSaveToFile = saveToFile as jest.Mock;

describe("Main tests suites", () => {

    beforeEach(() => {
        consoleErrorMock = jest.spyOn(console, 'error'); // .mockImplementation( () => {} );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should call the mockGetGitOrgData and saveToFile functions", async () => {
        mockGetGitOrgData.mockReturnValueOnce( () => Promise.resolve( {} ) );
        mockSaveToFile.mockReturnValueOnce( () => Promise.resolve( {} ) );

        await main();

        expect(mockGetGitOrgData).toHaveBeenCalledTimes(3);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(consoleErrorMock).toHaveBeenCalledTimes(0);
    });

    test("should call the saveToFile function and catch the saving data to file error", async () => {
        const errMsg = "Error while saving data to file!"
        mockGetGitOrgData.mockReturnValueOnce( () => Promise.resolve( {} ) );
        mockSaveToFile.mockRejectedValueOnce( new Error(errMsg) as never );

        await main();

        expect(mockGetGitOrgData).toHaveBeenCalledTimes(3);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
        expect(consoleErrorMock).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });
});
