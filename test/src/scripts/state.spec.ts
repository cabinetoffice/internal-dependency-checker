jest.mock('../../../src/utils/fs');
jest.mock('../../../src/utils/logger', () => ({
    log: {
        error: jest.fn()
    }
}));

import { describe, expect, test, jest, afterEach } from '@jest/globals';

import { state } from "../../../src/scripts/state";
import {
    checkFileExists,
    saveToFile
} from "../../../src/utils/fs";

import { log } from '../../../src/utils/logger';

const mockLogError = log.error as jest.Mock;

const mockCheckFileExists = checkFileExists as jest.Mock;
const mockSaveToFile = saveToFile as jest.Mock;

describe("State tests suites", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("should call the checkFileExists and saveToFile functions", async () => {
        await state();

        expect(mockCheckFileExists).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(mockLogError).toHaveBeenCalledTimes(0);
    });

    test("should call the saveToFile function and catch the saving data to file error", async () => {
        const errMsg = "Error while saving data to file!";
        mockSaveToFile.mockRejectedValueOnce(new Error(errMsg) as never);

        await state();

        expect(mockCheckFileExists).toHaveBeenCalledTimes(1);
        expect(mockSaveToFile).toHaveBeenCalledTimes(1);
        expect(mockLogError).toHaveBeenCalledTimes(1);
        expect(mockLogError).toHaveBeenCalledWith(`Error: ${errMsg}`);
    });

});
