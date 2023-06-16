jest.mock('../../../src/utils/exec');
jest.mock('../../../src/utils/index');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';
import fs from 'node:fs';

import { exec_command } from "../../../src/utils/exec";
import { setTimeOut, updateStateFile } from "../../../src/utils/index";
import {
    saveToFile,
    checkFileExists,
    cloneRepos
} from "../../../src/utils/fs";

const spyConsoleLog = jest.spyOn(console, 'log');
const spyConsoleError = jest.spyOn(console, 'error');

const spyWriteFileCall = jest.spyOn(fs.promises, 'writeFile');
const spyReadFileCall = jest.spyOn(fs.promises, 'readFile');
const spyReaddirSyncCall = jest.spyOn(fs, 'readdirSync');

const mockExecCommandCall = exec_command as jest.Mock;
const mockSetTimeOutCall = setTimeOut as jest.Mock;
const mockUpdateStateFileCall = updateStateFile as jest.Mock;

describe("UTILS fs tests suites", () => {

    beforeEach(() => {
        spyConsoleLog.mockImplementation(() => {/**/});
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("saveToFile(...)", () => {

        const fileName = "mock_name.json";

        test('should call writeFile and log saved data', async () => {
            spyWriteFileCall.mockImplementationOnce(
                () => Promise.resolve({} as any)
            );

            await saveToFile(fileName, {});

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(spyConsoleLog).toHaveBeenCalledWith(`Saved data to ${fileName}.`);
            expect(spyConsoleError).toHaveBeenCalledTimes(0);
        });

        test('should call writeFile and catch error', async () => {
            const errMsg = "Api call Error";

            spyWriteFileCall.mockRejectedValueOnce(new Error(errMsg));

            await saveToFile(fileName, {});

            expect(spyConsoleLog).toHaveBeenCalledTimes(0);
            expect(spyConsoleError).toHaveBeenCalledTimes(1);
            expect(spyConsoleError).toHaveBeenCalledWith(`Error: ${errMsg}`);
        });
    });

    describe("checkFileExists(...)", () => {

        const mockName1 = "repo1";
        const mockName2 = "name.tf";
        const directoryPath = "mock/path";
        const mockReadDirObj = { name: mockName1, isFile: () => true, isDirectory: () => true };

        test('should call readdirSync without going into the for loop', () => {
            spyReaddirSyncCall.mockReturnValueOnce([]);

            checkFileExists(directoryPath);

            expect(spyReaddirSyncCall).toHaveBeenCalledTimes(1);
        });

        test('should call readdirSync and iterate on files object', () => {

            mockUpdateStateFileCall.mockReturnValueOnce(() => {/**/});
            spyReaddirSyncCall.mockReturnValueOnce([mockReadDirObj] as any);
            spyReaddirSyncCall.mockReturnValueOnce([{
                ...mockReadDirObj,
                name: mockName2,
                isDirectory: () => false
            }] as any);
            checkFileExists(directoryPath);

            expect(spyReaddirSyncCall).toHaveBeenCalledTimes(2);
            expect(mockUpdateStateFileCall).toHaveBeenCalledTimes(1);
            expect(mockUpdateStateFileCall).toHaveBeenCalledWith(`${directoryPath}/${mockName1}/${mockName2}`, mockName2, ".tf");
        });

        test('should call readdirSync without going into the for loop', () => {
            const errMsg = "files is not iterable";

            spyReaddirSyncCall.mockReturnValueOnce(null as any);
            checkFileExists(directoryPath);

            expect(spyReaddirSyncCall).toHaveBeenCalledTimes(1);

            expect(spyConsoleError).toHaveBeenCalledTimes(1);
            expect(spyConsoleError).toHaveBeenCalledWith(`Error: ${errMsg}`);
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
                () => Promise.resolve(json)
            );

            mockExecCommandCall.mockReturnValueOnce(() => Promise.resolve({}));
            mockSetTimeOutCall.mockImplementationOnce(() => Promise.resolve(null));

            await cloneRepos();

            expect(mockExecCommandCall).toHaveBeenCalledTimes(3);
            expect(mockSetTimeOutCall).toHaveBeenCalledTimes(3);
            expect(mockExecCommandCall).toHaveBeenCalledWith(`git clone https://github.com/org1/repo1 infrastructure/repos/org1/repo1`, 1, 3);
            expect(mockExecCommandCall).toHaveBeenCalledWith(`git clone https://github.com/org1/repo2 infrastructure/repos/org1/repo2`, 2, 3);
            expect(mockExecCommandCall).toHaveBeenCalledWith(`git clone https://github.com/org1/repo3 infrastructure/repos/org1/repo3`, 3, 3);
        });

        test('should call readFile and return reject promise object', async () => {
            const errMsg = "Error executing command";

            spyReadFileCall.mockRejectedValueOnce(new Error(errMsg));

            await cloneRepos();

            expect(mockSetTimeOutCall).toHaveBeenCalledTimes(0);
            expect(mockExecCommandCall).toHaveBeenCalledTimes(0);

            expect(spyConsoleError).toHaveBeenCalledWith(`Error: ${errMsg}`);
        });
    });
});
