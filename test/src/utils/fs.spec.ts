jest.mock('../../../src/utils/exec');
jest.mock('../../../src/utils/index');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';
import { SpiedFunction } from 'jest-mock';
import fs from 'node:fs';

import {
    saveToFile,
    checkFileExists,
    cloneRepos
} from "../../../src/utils/fs";

import {
    exec_command
} from "../../../src/utils/exec";

import {
    setTimeOut
} from "../../../src/utils/index";

import { MOCK_REPOS_DATA } from '../../mock/repos_info';

let consoleLogMock: SpiedFunction;
let consoleErrorMock: SpiedFunction;

let spyWriteFileCall = jest.spyOn(fs.promises, 'writeFile');
let spyReadFileCall = jest.spyOn(fs.promises, 'readFile');
let spyReaddirSyncCall = jest.spyOn(fs, 'readdirSync');
let spyStatSyncCall = jest.spyOn(fs, 'statSync');

let mockExecCommandCall = exec_command as jest.Mock;
let mockSetTimeOutCall = setTimeOut as jest.Mock;

describe("UTILS fs tests suites", () => {

    beforeEach(() => {
        consoleLogMock = jest.spyOn(console, 'log').mockImplementation( () => {} );
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation( () => {} );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("saveToFile(...)", () => {

        test('should call writeFile and log saved data', async () => {
            const fileName = "mock_name.json";

            spyWriteFileCall.mockImplementationOnce(
                () => Promise.resolve( { } as any)
            );

            await saveToFile(fileName, {});

            expect(consoleLogMock).toHaveBeenCalledTimes(1);
            expect(consoleLogMock).toHaveBeenCalledWith(`Saved data to ${fileName}.`);
            expect(consoleErrorMock).toHaveBeenCalledTimes(0);
        });

        test('should call writeFile and catch error', async () => {
            const fileName = "mock_name.json";
            const errMsg = "Api call Error";

            spyWriteFileCall.mockRejectedValueOnce( new Error(errMsg) );

            await saveToFile(fileName, {});

            expect(consoleLogMock).toHaveBeenCalledTimes(0);
            expect(consoleErrorMock).toHaveBeenCalledTimes(1);
            expect(consoleErrorMock).toHaveBeenCalledWith(`Error while saving data to ${fileName}: ${errMsg}`);
        });
    });

    describe("checkFileExists(...)", () => {

        const directoryPath = "mock/path";

        test('should call readdirSync without going into the for loop', async () => {
            spyReaddirSyncCall.mockReturnValueOnce( [] );

            checkFileExists(directoryPath);

            expect(spyReaddirSyncCall).toHaveBeenCalledTimes(1);
            expect(spyStatSyncCall).toHaveBeenCalledTimes(0);
        });

        test('should call readdirSync without going into the for loop', async () => {
            spyReaddirSyncCall.mockReturnValueOnce( [] );

            checkFileExists(directoryPath);

            expect(spyReaddirSyncCall).toHaveBeenCalledTimes(1);
            expect(spyStatSyncCall).toHaveBeenCalledTimes(0);
        });

    });

    describe("cloneRepos(...)", () => {

        test('should call readFile and log saved data with empty object', async () => {
            const json = `{"repos": [
                {"full_name": "org1/repo1", "clone_url": "https://github.com/org1/repo1"},
                {"full_name": "org1/repo2", "clone_url": "https://github.com/org1/repo2"},
                {"full_name": "org1/repo3", "clone_url": "https://github.com/org1/repo3"}
            ]}`;

            spyReadFileCall.mockImplementationOnce(
                () => Promise.resolve( json )
            );

            mockExecCommandCall.mockReturnValueOnce( () => Promise.resolve( {} ) );
            mockSetTimeOutCall.mockImplementationOnce( () => Promise.resolve( null ) );

            await cloneRepos();

            expect(mockExecCommandCall).toHaveBeenCalledTimes(3);
            expect(mockSetTimeOutCall).toHaveBeenCalledTimes(3);
            expect(mockExecCommandCall).toHaveBeenCalledWith(`git clone https://github.com/org1/repo1 infrastructure/repos/org1/repo1`, 1, 3);
            expect(mockExecCommandCall).toHaveBeenCalledWith(`git clone https://github.com/org1/repo2 infrastructure/repos/org1/repo2`, 2, 3);
            expect(mockExecCommandCall).toHaveBeenCalledWith(`git clone https://github.com/org1/repo3 infrastructure/repos/org1/repo3`, 3, 3);
        });

        test('should call readFile and return reject promise object', async () => {
            const errMsg = "Error executing command";

            spyReadFileCall.mockRejectedValueOnce( new Error(errMsg) );

            await cloneRepos();

            expect(mockSetTimeOutCall).toHaveBeenCalledTimes(0);
            expect(mockExecCommandCall).toHaveBeenCalledTimes(0);

            expect(consoleErrorMock).toHaveBeenCalledWith(`Error: ${errMsg}`);
        });
    });
});
