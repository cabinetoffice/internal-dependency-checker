jest.mock('../../src/utils/fs');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';
import { SpiedFunction } from 'jest-mock';

import { state } from "../../src/state";
import { 
    checkFileExists,
    saveToFile
 } from "../../src/utils/fs";

let consoleErrorMock: SpiedFunction;
let mockCheckFileExists = checkFileExists as jest.Mock;
let mockSaveToFile = saveToFile as jest.Mock;

describe("State tests suites", () => {

    beforeEach(() => {
        consoleErrorMock = jest.spyOn(console, 'error'); // .mockImplementation( () => {} );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should call the checkFileExists and saveToFile functions", async () => {
        mockCheckFileExists.mockReturnValueOnce( {} );
        mockSaveToFile.mockReturnValueOnce( () => Promise.resolve( {} ) );

        await state();

        expect(mockCheckFileExists).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(consoleErrorMock).toHaveBeenCalledTimes(0);
    });

    test("should call the saveToFile function and catch the saving data to file error", async () => {
        const errMsg = "Error while saving data to file!"
        mockCheckFileExists.mockReturnValueOnce( {} );
        mockSaveToFile.mockRejectedValueOnce( new Error(errMsg) as never );

        await state();

        expect(mockCheckFileExists).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(consoleErrorMock).toHaveBeenCalledTimes(1);
        expect(consoleErrorMock).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });

});
