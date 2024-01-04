jest.mock('../../../src/service/github');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import {
    getTechFile,
    updateStateFile,
    setTimeOut,
    mapData,
    getInfo,
    setOrgData,
    setTeamsData,
    setMembersData,
    setReposData,
    getPerTeamData,
    setPerTeamData
} from "../../../src/utils/index";

import {
    mockFileExtensionTechData,
    mockTechData
} from "../../mock/data";

import {
    CLONE_TIMEOUT,
    MEMBERS_PER_TEAM_KEY,
    ORG_DATA,
    REPOS_PER_TEAM_KEY,
    STATE_DEPENDENCIES,
    TMP_DATA
} from '../../../src/config';

import {
    mockStateDependenciesData
} from "../../mock/state";
import {
    MOCK_WHAT,
    MOCK_HEADERS,
    MOCK_REPO_URL,
    MOCK_REPOS_DATA,
    MOCK_REPOS_TEAMS_DATA,
    MOCK_MEMBERS_TEAMS_DATA,
    MOCK_REPOS_REPOSITORIES,
    MOCK_REPOS_MEMBERS,
    MOCK_JSON_FETCH_RESPONSE,
    MOCK_REPOS_MEMBERS_NAME,
    MOCK_REPOS_REPO_NAME,
    MOCK_ORG_DATA,
    MOCK_PER_TEAM_DATA,
    MOCK_ORG_TEAMS,
    MOCK_ORG_MEMBERS,
    MOCK_ORG_REPOS,
    MOCK_REPOS_REPO_DATA,
    MOCK_GET_MEMBERS_PER_TEAM_DATA,
    GET_PER_TEAM_DATA_MOCK,
    MOCK_REPOS_TEAMS_NAME
} from '../../mock/repos_info';

import { MemberDetails, RepoDetails, TeamDetails } from '../../../src/types/config';
import { getMembersPerTeamData } from '../../../src/service/github';

const mockGetMembersPerTeam = getMembersPerTeamData as jest.Mock<any>;

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

    describe("mapData(...)", () => {

        test(`should call mapData and correctly mapping data`, () => {
            const data = [{ "a": 1, "b": 2, "c": 3 }, { "a": 3, "b": 4, "r": 6 }, { "a": 5, "b": 6 }];
            const expected = [{ "a": 1, "b": 2 }, { "a": 3, "b": 4 }, { "a": 5, "b": 6 }];
            const keys = ["a", "b"];
            expect(mapData(data, keys)).toEqual(expected);
        });

    });

    // ************************************************************ //

    describe("getInfo(...)", () => {

        afterEach(() => {
            // Reset object data
            TMP_DATA["repos"]["list"] = [];
        });

        test('should TMP_DATA["repos"]["list"] be empty if no data fetched', async () => {
            spyFetchCall.mockImplementationOnce(
                () => Promise.resolve({ json: () => Promise.resolve([]) } as any)
            );

            await getInfo(MOCK_WHAT, "list", MOCK_REPO_URL);

            expect(TMP_DATA["repos"]["list"]).toEqual([]);

            expect(spyFetchCall).toHaveBeenCalledWith(`${MOCK_REPO_URL}?page=1&per_page=100`, MOCK_HEADERS);
            expect(spyFetchCall).toHaveBeenCalledTimes(1);

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(spyConsoleError).toHaveBeenCalledTimes(0);
        });

        test('should return correct list', async () => {
            spyFetchCall.mockImplementationOnce(
                () => Promise.resolve({ json: () => Promise.resolve(MOCK_JSON_FETCH_RESPONSE) } as any)
            );

            await getInfo(MOCK_WHAT, "list", MOCK_REPO_URL);

            expect(TMP_DATA["members"]["list"]).toEqual([]);
            expect(TMP_DATA["teams"]["list"]).toEqual([]);

            const lengthList = TMP_DATA["repos"]["list"].length;
            expect(lengthList).toEqual(Object.keys(MOCK_REPOS_DATA["repos"]["list"]).length);

            expect(spyFetchCall).toHaveBeenCalledTimes(1);

            expect(spyConsoleLog).toHaveBeenCalledTimes(1);
            expect(spyConsoleLog).toHaveBeenCalledWith(`${MOCK_REPO_URL}?page=1&per_page=100, page 1, retrieved ${lengthList}`);
            expect(spyConsoleError).toHaveBeenCalledTimes(0);
        });

        test('should catch the promise reject call', async () => {
            spyFetchCall.mockRejectedValueOnce(new Error("Api call Error"));

            await getInfo(MOCK_WHAT, "list", MOCK_REPO_URL);

            expect(spyFetchCall).toHaveBeenCalledTimes(1);
            expect(spyConsoleLog).toHaveBeenCalledTimes(0);
            expect(spyConsoleError).toHaveBeenCalledTimes(1);
        });
    });

    // ************************************************************ //

    describe("setTeamsData(...)", () => {

        beforeEach(() => {
            ORG_DATA["teams"] = { "list": [], "details": {} };
        });

        test(`should correctly populate ORG_DATA with teams data`, async () => {
            setTeamsData(MOCK_REPOS_TEAMS_DATA);
            
            expect(ORG_DATA["teams"]).toEqual(MOCK_ORG_TEAMS["teams"]);
        });

    });

    // ************************************************************ //

    describe("setMembersData(...)", () => {

        beforeEach(() => {
            ORG_DATA["members"] = { "list": [], "details": {} };
        });

        test(`should correctly populate ORG_DATA with teams data`, async () => {
            setMembersData(MOCK_MEMBERS_TEAMS_DATA);
            
            expect(ORG_DATA["members"]).toEqual(MOCK_ORG_MEMBERS["members"]);
        });

    });

    describe("setReposData(...)", () => {

        beforeEach(() => {
            ORG_DATA["repos"] = { "list": [], "details": {} };
        });

        test(`should correctly populate ORG_DATA with teams data`, async () => {
            setReposData(MOCK_REPOS_REPO_DATA);
            
            expect(ORG_DATA["repos"]).toEqual(MOCK_ORG_REPOS["repos"]);
        });

    });

    // ************************************************************ //

    describe("getPerTeamData(...)", () => {

        beforeEach(() => {
            ORG_DATA["teams"]["list"] = MOCK_ORG_TEAMS["teams"]['list'];
            ORG_DATA["teams"]["details"] = MOCK_ORG_TEAMS["teams"]["details"];
        });

        test('should return all members per teams ', async () => {
            mockGetMembersPerTeam.mockResolvedValue(MOCK_GET_MEMBERS_PER_TEAM_DATA);

            const perTeamData = await getPerTeamData();

            expect(perTeamData).toEqual(GET_PER_TEAM_DATA_MOCK);

        });
    });

    // ************************************************************ //

    describe("getPerTeamData(...)", () => {

        beforeEach(() => {
            ORG_DATA["teams"]["list"] = MOCK_ORG_TEAMS["teams"]['list'];
            ORG_DATA["teams"]["details"] = MOCK_ORG_TEAMS["teams"]["details"];
        });

        test('should assign members from perTeamData to ORG_DATA teams', async () => {
            setPerTeamData(GET_PER_TEAM_DATA_MOCK);

            const orgDataTeam = ORG_DATA.teams.details[MOCK_REPOS_TEAMS_NAME] as TeamDetails;

            expect(orgDataTeam.members).toEqual(GET_PER_TEAM_DATA_MOCK[MOCK_REPOS_TEAMS_NAME].members);
        });
    });

    // ************************************************************ //

    describe("setOrgData(...)", () => {

        beforeEach(() => {
            // Reset objects
            TMP_DATA["repos"] = { "list": [] };
            TMP_DATA["members"] = { "list": [] };
            TMP_DATA["teams"] = { "list": [] };
            TMP_DATA[MEMBERS_PER_TEAM_KEY] = {};
            TMP_DATA[REPOS_PER_TEAM_KEY] = {};

            ORG_DATA["repos"] =  { "list": [], "details": {} };
            ORG_DATA["members"] =  { "list": [], "details": {} };
            ORG_DATA["teams"] =  { "list": [], "details": {} };
        });

        test(`should correctly populate ORG_DATA with repos information`, () => {
            TMP_DATA["repos"]["list"] = [MOCK_REPOS_REPOSITORIES[0]];

            setOrgData();

            MOCK_ORG_DATA["repos"]["details"][MOCK_REPOS_REPO_NAME]["members"] = [];
            MOCK_ORG_DATA["repos"]["details"][MOCK_REPOS_REPO_NAME]["teams"] = [];
            expect(ORG_DATA["repos"]).toEqual(MOCK_ORG_DATA["repos"]);
            expect(ORG_DATA["members"]).toEqual({ "list": [], "details": {} });
            expect(ORG_DATA["teams"]).toEqual({ "list": [], "details": {} });
        });

        test(`should correctly populate ORG_DATA with members data`, () => {
            TMP_DATA["members"]["list"] = [MOCK_REPOS_MEMBERS[0]];

            setOrgData();

            MOCK_ORG_DATA["members"]["details"][MOCK_REPOS_MEMBERS_NAME]["repos"] = [];
            MOCK_ORG_DATA["members"]["details"][MOCK_REPOS_MEMBERS_NAME]["teams"] = [];
            expect(ORG_DATA["members"]).toEqual(MOCK_ORG_DATA["members"]);
            expect(ORG_DATA["repos"]).toEqual({ "list": [], "details": {} });
            expect(ORG_DATA["teams"]).toEqual({ "list": [], "details": {} });
        });

        test(`should correctly populate ORG_DATA with teams data without duplication`, () => {
            TMP_DATA["teams"]["list"] = [MOCK_REPOS_TEAMS_DATA[0]];
            TMP_DATA[MEMBERS_PER_TEAM_KEY] = MOCK_PER_TEAM_DATA[MEMBERS_PER_TEAM_KEY];
            TMP_DATA[REPOS_PER_TEAM_KEY] = MOCK_PER_TEAM_DATA[REPOS_PER_TEAM_KEY];

            ORG_DATA["repos"] = MOCK_ORG_DATA["repos"];
            ORG_DATA["members"] = MOCK_ORG_DATA["members"];

            setOrgData();

            expect(ORG_DATA["repos"]).toEqual( MOCK_ORG_DATA["repos"] );
            expect(ORG_DATA["members"]).toEqual( MOCK_ORG_DATA["members"] );
            expect(ORG_DATA["teams"]).toEqual( MOCK_ORG_DATA["teams"] );

            // Check duplication removed
            expect((ORG_DATA["members"]["details"][MOCK_REPOS_MEMBERS_NAME] as MemberDetails)["repos"].length).toBe( 1 );
            expect((ORG_DATA["repos"]["details"][MOCK_REPOS_REPO_NAME] as RepoDetails)["members"].length).toBe( 1 );
        });

    });

    // ************************************************************ //

});
