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
import { MOCK_REPOS_DATA } from '../../mock/repos_info';
import { REPOS_KEY } from '../../../src/types/config';

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
            spyWriteFileCall.mockImplementationOnce(() => Promise.resolve());

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

        test('should return null from readdirSync and catch the error', () => {
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
            const mockReposDataLength = MOCK_REPOS_DATA[REPOS_KEY].list.length;

            spyReadFileCall.mockImplementationOnce(
                () => Promise.resolve(JSON.stringify(MOCK_REPOS_DATA) as any)
            );

            await cloneRepos();

            expect(mockExecCommandCall).toHaveBeenCalledTimes(mockReposDataLength);
            expect(mockSetTimeOutCall).toHaveBeenCalledTimes(mockReposDataLength);
            expect(mockExecCommandCall).toHaveBeenCalledWith(
                `git clone https://github.com/org1/repo1.git infrastructure/repos/org1/repo1`, 1,
                mockReposDataLength);
            expect(mockExecCommandCall).toHaveBeenCalledWith(
                `git clone https://github.com/org1/repo2.git infrastructure/repos/org1/repo2`, 2,
                mockReposDataLength);
            expect(mockExecCommandCall).toHaveBeenCalledWith(
                `git clone https://github.com/org1/repo3.git infrastructure/repos/org1/repo3`, 3,
                mockReposDataLength);
            expect(mockExecCommandCall).toHaveBeenCalledWith(
                `git clone https://github.com/org1/repo4.git infrastructure/repos/org1/repo4`, 4,
                mockReposDataLength);
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
