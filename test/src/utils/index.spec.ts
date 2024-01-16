jest.mock('../../../src/service/github');
jest.mock('../../../src/utils/logger', () => ({
    log: {
        info: jest.fn(),
        error: jest.fn()
    }
}));

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import {
    getTechFile,
    updateStateFile,
    setTimeOut,
    setTeamsData,
    setMembersData,
    setReposData,
    setTeamsMembersReposInnerData
} from "../../../src/utils/index";

import {
    MOCK_FILE_EXT_TECH_DATA,
    MOCK_TECH_DATA
} from "../../mock/data";

import {
    CLONE_TIMEOUT,
    STATE_DEPENDENCIES
} from '../../../src/config';

import {
    mockStateDependenciesData
} from "../../mock/state";
import {
    MOCK_ORG_TEAMS,
    MOCK_ORG_MEMBERS,
    MOCK_ORG_REPOS,
    MOCK_GET_REPOS_API_SDK_RESPONSE,
    MOCK_GET_MEMBERS_API_SDK_RESPONSE,
    MOCK_GET_TEAMS_API_SDK_RESPONSE,
    MOCK_GET_REPOS_PER_TEAM_API_SDK_RESPONSE,
    MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE,
    MOCK_REPO_NAME,
    MOCK_MEMBERS_NAME,
    MOCK_TEAMS_NAME
} from '../../mock/repos_info';

import { getData } from '../../../src/service/github';

import { log } from '../../../src/utils/logger';

const mockLogError = log.error as jest.Mock;
const mockLogInfo = log.info as jest.Mock;

const spySetTimeoutCall = jest.spyOn(global, 'setTimeout');

const mockGetData = getData as jest.Mock;

/* eslint-disable */
describe("UTILS Index tests suites", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    // ************************************************************ //

    describe("getTechFile(...)", () => {

        test.each(MOCK_TECH_DATA)
            (`should return related lang/tech and file order based on filename getTechFile($fileName)`,
                ({ fileName, tech, key }) => {
                    expect(getTechFile(fileName)).toEqual({ tech, key });
                });

        test.each(MOCK_FILE_EXT_TECH_DATA)
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
                    expect(mockLogInfo).toHaveBeenCalledTimes(1);
                    expect(mockLogError).toHaveBeenCalledTimes(0);
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
            expect(mockLogError).toHaveBeenCalledTimes(1);
            expect(mockLogError).toHaveBeenCalledWith(errMsg);

            expect(() => {
                updateStateFile(filePath, fileName, fileExtension);
            }).toThrow('This should not happen!');

            expect(mockLogInfo).toHaveBeenCalledTimes(0);
            expect(mockLogError).toHaveBeenCalledTimes(2);
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

    // ************************************************************ //

    describe("setReposData(...)", () => {
        test(`should return a correct obj with list of repos and details`, () => {
            const obj = setReposData(MOCK_GET_REPOS_API_SDK_RESPONSE.resource);
            expect(obj).toEqual(MOCK_ORG_REPOS.repos);
        });
    });

    // ************************************************************ //

    describe("setMembersData(...)", () => {
        test(`should return a correct obj with list of members and details`, () => {
            const obj = setMembersData(MOCK_GET_MEMBERS_API_SDK_RESPONSE.resource);
            expect(obj).toEqual(MOCK_ORG_MEMBERS.members);
        });
    });

    // ************************************************************ //

    describe("setTeamsData(...)", () => {
        afterEach(() => {
            jest.resetAllMocks();
        });

        test(`should return a correct obj with list of teams, details and repos/memebers per team`, async () => {
            const baseUrl = MOCK_GET_TEAMS_API_SDK_RESPONSE.resource[0].url;

            mockGetData.mockReturnValueOnce(MOCK_GET_REPOS_PER_TEAM_API_SDK_RESPONSE.resource);
            mockGetData.mockReturnValueOnce(MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE.resource);

            const obj = await setTeamsData(MOCK_GET_TEAMS_API_SDK_RESPONSE.resource);

            expect(mockGetData).toHaveBeenCalledWith("getReposPerTeam", `${baseUrl}/repos`);
            expect(mockGetData).toHaveBeenCalledWith("getMembersPerTeam", `${baseUrl}/members`);
            
            expect(obj).toEqual(MOCK_ORG_TEAMS.teams);
        });
    });

    // ************************************************************ //

    describe("setTeamsMembersReposInnerData(...)", () => {
        test(`should correctly populate nested data for members and repos main objects`, async () => {
            const obj = { ...MOCK_ORG_REPOS, ...MOCK_ORG_MEMBERS, ...MOCK_ORG_TEAMS };
            const obj2 = { ...MOCK_ORG_REPOS, ...MOCK_ORG_MEMBERS, ...MOCK_ORG_TEAMS };
            obj2.repos.details[MOCK_REPO_NAME].members.push(MOCK_MEMBERS_NAME as never)
            obj2.repos.details[MOCK_REPO_NAME].teams.push(MOCK_TEAMS_NAME as never)
            obj2.members.details[MOCK_MEMBERS_NAME].repos.push(MOCK_REPO_NAME as never)
            obj2.members.details[MOCK_MEMBERS_NAME].teams.push(MOCK_TEAMS_NAME as never)
            setTeamsMembersReposInnerData(obj);
            expect(obj).toEqual(obj2);
        });
    });

});