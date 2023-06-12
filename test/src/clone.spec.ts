jest.mock('../../src/utils/fs');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';
import { SpiedFunction } from 'jest-mock';

import { clone } from "../../src/clone";
import { cloneRepos } from "../../src/utils/fs";

let consoleLogMock: SpiedFunction;
let consoleErrorMock: SpiedFunction;
let mockCloneReposCall = cloneRepos as jest.Mock;

describe("Clone tests suites", () => {

    beforeEach(() => {
        consoleLogMock = jest.spyOn(console, 'log'); //.mockImplementation( () => {} );
        consoleErrorMock = jest.spyOn(console, 'error'); //.mockImplementation( () => {} );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should call the cloneRepos function", async () => {
        mockCloneReposCall.mockReturnValueOnce( () => Promise.resolve( {} ) );

        await clone();

        expect(mockCloneReposCall).toHaveBeenCalledTimes(1);
        expect(consoleLogMock).toHaveBeenCalledTimes(1);
        expect(consoleLogMock).toHaveBeenCalledWith("This script will likely take a few hours to complete.");
        expect(consoleErrorMock).toHaveBeenCalledTimes(0);
    });

    test("should call the cloneRepos function and catch the parsing error", async () => {
        const errMsg = "Error parsing JSON"
        mockCloneReposCall.mockRejectedValueOnce( new Error(errMsg) as never );

        await clone();

        expect(mockCloneReposCall).toHaveBeenCalledTimes(1);
        expect(consoleLogMock).toHaveBeenCalledTimes(1);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
        expect(consoleErrorMock).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });

});
