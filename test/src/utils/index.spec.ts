import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import {
    getTechFile,
    updateStateFile,
    getGitOrgData,
    setTimeOut,
    setTeamsData
} from "../../../src/utils/index";

import {
    mockFileExtensionTechData,
    mockTechData
} from "../../mock/data";

import {
    CLONE_TIMEOUT,
    ORG_DATA,
    STATE_DEPENDENCIES,
    TEAMS_DATA
} from '../../../src/config';

import {
    mockStateDependenciesData
} from "../../mock/state";
import {
    MOCK_WHAT,
    MOCK_HEADERS,
    MOCK_REPO_URL,
    MOCK_REPOS_INFO_EMPTY,
    MOCK_REPOS_DATA,
    MOCK_ORGANIZATION,
    MOCK_REPOS_TEAMS_DATA,
    MOCK_TEAMS_DATA,
    MOCK_REPOS_TEAMS_NAME,
    MOCK_TEAMS_REPOSITORIES,
    MOCK_TEAMS_MEMBERS,
    MOCK_REPOS_TEAMS_DESCRIPTION
} from '../../mock/repos_info';

const spyConsoleLog = jest.spyOn(console, 'log');
const spyConsoleError = jest.spyOn(console, 'error');

const spyFetchCall = jest.spyOn(global, 'fetch');
const spySetTimeoutCall = jest.spyOn(global, 'setTimeout');

/* eslint-disable */
describe("UTILS Index tests suites", () => {

    beforeEach(() => {
        spyConsoleLog.mockImplementation(() => {/**/});
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // ************************************************************ //

    describe("getTechFile(...)", () => {

        test.each(mockTechData)
            (`should return related lang/tech and file order based on filename getTechFile($fileName)`,
                ({ fileName, tech, key }) => {
                    expect(getTechFile(fileName)).toEqual({ tech, key });
                });

        test.each(mockFileExtensionTechData)
            (`should return related lang/tech and file order based on fileExtension getTechFile("", "$fileExtension")`,
                ({ fileExtension, tech, key }) => {
                    expect(getTechFile("any", fileExtension)).toEqual({ tech, key });
                });

        test(`should throw an error based on wrong filename getTechFile("any")`, () => {
            const errMsg = 'Error: fix FILES_NAME object! File "any" has to be added.';
            expect(() => { getTechFile("any"); }).toThrow(Error);
            expect(() => { getTechFile("any"); }).toThrow(errMsg);
        });
    });

    // ************************************************************ //

    describe("updateStateFile(...)", () => {

        test.each(mockStateDependenciesData)
            (`should update STATE_DEPENDENCIES object based on filePath: $filePath and fileName: $fileName`,
                ({ filePath, fileName, fileExtension, expected }) => {
                    updateStateFile(filePath, fileName, fileExtension);
                    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
                    expect(spyConsoleError).toHaveBeenCalledTimes(0);
                    expect(STATE_DEPENDENCIES).toEqual(expected);
                });

        test(`should throw an error based on wrong data passed to updateStateFile`, () => {
            const mockData = mockStateDependenciesData[3];
            const { filePath, fileName, fileExtension } = mockData;

            STATE_DEPENDENCIES["node"] = mockData["expected"]["node"];

            expect(() => {
                updateStateFile(filePath, fileName, fileExtension);
            }).toThrow(Error);

            const errMsg = "file name: repos__org1__repo1, file Path: repos/org1/repo1/package-lock.json, key: file2";
            expect(spyConsoleError).toHaveBeenCalledTimes(1);
            expect(spyConsoleError).toHaveBeenCalledWith(errMsg);

            expect(() => {
                updateStateFile(filePath, fileName, fileExtension);
            }).toThrow('This should not happen!');

            expect(spyConsoleLog).toHaveBeenCalledTimes(0);
            expect(spyConsoleError).toHaveBeenCalledTimes(2);
        });
    });

    // ************************************************************ //

    describe("getGitOrgData(...)", () => {

        afterEach(() => {
            // Reset object data
            ORG_DATA["members"] = []; ORG_DATA["repos"] = []; ORG_DATA["teams"] = [];
        });

        test('should return empty list', async () => {
            spyFetchCall.mockImplementationOnce(
                () => Promise.resolve({ json: () => Promise.resolve(ORG_DATA[MOCK_WHAT]) } as any)
            );

            await getGitOrgData(MOCK_WHAT, MOCK_ORGANIZATION);

            expect(ORG_DATA).toEqual(MOCK_REPOS_INFO_EMPTY);

            expect(spyFetchCall).toHaveBeenCalledWith(MOCK_REPO_URL, MOCK_HEADERS);
            expect(spyFetchCall).toHaveBeenCalledTimes(1);

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(spyConsoleError).toHaveBeenCalledTimes(0);
        });

        test('should return correct list', async () => {
            spyFetchCall
                .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(MOCK_REPOS_DATA) } as any))
                .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([]) } as any));

            await getGitOrgData(MOCK_WHAT, MOCK_ORGANIZATION);

            expect(Object.keys(ORG_DATA).length).toEqual(3);
            expect(ORG_DATA["members"]).toEqual([]);
            expect(ORG_DATA["teams"]).toEqual([]);
            expect(ORG_DATA["repos"]).toEqual(MOCK_REPOS_DATA);

            expect(spyFetchCall).toHaveBeenCalledWith(MOCK_REPO_URL, MOCK_HEADERS);
            expect(spyFetchCall).toHaveBeenCalledTimes(2);

            expect(spyConsoleLog).toHaveBeenCalledTimes(2);
            expect(spyConsoleError).toHaveBeenCalledTimes(0);
        });

        test('should catch the promise reject call', async () => {
            spyFetchCall.mockRejectedValueOnce(new Error("Api call Error"));

            await getGitOrgData(MOCK_WHAT, MOCK_ORGANIZATION);

            expect(ORG_DATA).toEqual(MOCK_REPOS_INFO_EMPTY);

            expect(spyFetchCall).toHaveBeenCalledWith(MOCK_REPO_URL, MOCK_HEADERS);
            expect(spyFetchCall).toHaveBeenCalledTimes(1);

            expect(spyConsoleLog).toHaveBeenCalledTimes(0);
            expect(spyConsoleError).toHaveBeenCalledTimes(1);
        });

        test('should return a null object from fetch call', async () => {
            const logMsg = `Get ${MOCK_WHAT} from ${MOCK_ORGANIZATION}, page 1, retrieved undefined`;
            spyFetchCall.mockImplementationOnce(
                () => Promise.resolve({ json: () => Promise.resolve(null) } as any)
            );

            await getGitOrgData(MOCK_WHAT, MOCK_ORGANIZATION);

            expect(ORG_DATA).toEqual(MOCK_REPOS_INFO_EMPTY);

            expect(spyFetchCall).toHaveBeenCalledWith(MOCK_REPO_URL, MOCK_HEADERS);
            expect(spyFetchCall).toHaveBeenCalledTimes(1);

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(spyConsoleLog).toHaveBeenCalledWith(logMsg);
            expect(spyConsoleError).toHaveBeenCalledTimes(0);
        });
    });

    // ************************************************************ //

    describe("setTeamsData(...)", () => {

        const membersUrl = `${MOCK_REPOS_TEAMS_DATA[0]["url"]}/members`;
        const repositoriesUrl = MOCK_REPOS_TEAMS_DATA[0]["repositories_url"];

        beforeEach(() => {
            ORG_DATA["teams"] = MOCK_REPOS_TEAMS_DATA;
        });

        test('should set TEAMS_DATA object with no members or repositories', async () => {
            const emptyValue = {};
            const teamsData = { ... MOCK_TEAMS_DATA } as any;
            teamsData[MOCK_REPOS_TEAMS_NAME]["members"] = emptyValue;
            teamsData[MOCK_REPOS_TEAMS_NAME]["repositories"] = emptyValue;

            spyFetchCall
                .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(emptyValue) } as any))
                .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(emptyValue) } as any));

            await setTeamsData();

            expect(TEAMS_DATA).toEqual(teamsData);

            expect(spyFetchCall).toHaveBeenCalledTimes(2);
            expect(spyFetchCall).toHaveBeenCalledWith(membersUrl, MOCK_HEADERS);
            expect(spyFetchCall).toHaveBeenCalledWith(repositoriesUrl, MOCK_HEADERS);

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(spyConsoleLog).toHaveBeenCalledWith(`Get members info for ${MOCK_REPOS_TEAMS_NAME} team`);
            expect(spyConsoleError).toHaveBeenCalledTimes(0);
        });

        test('should set TEAMS_DATA correctly', async () => {
            spyFetchCall
                .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(MOCK_TEAMS_MEMBERS) } as any))
                .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(MOCK_TEAMS_REPOSITORIES) } as any));

            await setTeamsData();

            expect(Object.keys(TEAMS_DATA).length).toEqual(1);
            expect(TEAMS_DATA[MOCK_REPOS_TEAMS_NAME]["members"]).toEqual(MOCK_TEAMS_MEMBERS);
            expect(TEAMS_DATA[MOCK_REPOS_TEAMS_NAME]["repositories"]).toEqual(MOCK_TEAMS_REPOSITORIES);
            expect(TEAMS_DATA[MOCK_REPOS_TEAMS_NAME]["description"]).toEqual(MOCK_REPOS_TEAMS_DESCRIPTION);

            expect(spyFetchCall).toHaveBeenCalledTimes(2);

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(spyConsoleLog).toHaveBeenCalledWith(`Get members info for ${MOCK_REPOS_TEAMS_NAME} team`);
            expect(spyConsoleError).toHaveBeenCalledTimes(0);
        });

        test('should catch the promise reject call', async () => {
            spyFetchCall.mockRejectedValueOnce(new Error("Api call Error"));

            await setTeamsData();

            expect(spyFetchCall).toHaveBeenCalledTimes(1);
            expect(spyFetchCall).toHaveBeenCalledWith(membersUrl, MOCK_HEADERS);

            expect(spyConsoleLog).toHaveBeenCalledTimes(0);
            expect(spyConsoleError).toHaveBeenCalledTimes(1);
        });
    });

    // ************************************************************ //

    describe("setTimeOut(...)", () => {

        test('should call global setTimeout', async () => {
            spySetTimeoutCall.mockImplementationOnce((callback) => {
                if (typeof callback === 'function') {
                    callback();
                }
                return { hasRef: () => false } as NodeJS.Timeout;
            });

            await setTimeOut();

            expect(spySetTimeoutCall).toHaveBeenCalledTimes(1);
            expect(spySetTimeoutCall).toHaveBeenCalledWith(expect.any(Function), CLONE_TIMEOUT);
        });
    });

});
