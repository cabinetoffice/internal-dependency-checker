import { describe, expect, test, jest, afterEach } from '@jest/globals';

import { STATE_DEPENDENCIES } from "../../src/config.js";
import {
    getInfoFromOrganizationRepos,
    updateStateDependencies,
    getTechFile
} from "../../src/utils.js";

import {
    repos,
    mockTechData,
    mockInfoFromRepoData
} from "../mock/data.js";
import {
    mockStateDependenciesData
} from "../mock/state-dependencies-data.js";

const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

describe("UTILS tests suites", () => {

    afterEach(() => {
        jest.resetAllMocks();
     });

    // ************************************************************ //

    describe("Plain Functions", () => {

        describe("getInfoFromOrganizationRepos(...)", () => {

            let reposIndex = 0;
            test.each(repos)
                (`should return info filtered from repo object, repos[%#]`,
                    (repo) => {
                        expect(getInfoFromOrganizationRepos(repo)).toEqual(mockInfoFromRepoData[reposIndex++]);
                    });
        });

        describe("updateStateDependencies(...)", () => {

            test.each(mockStateDependenciesData)
                (`should update STATE_DEPENDENCIES object based on tech: $tech, repoName: $repoName, key: $key ...`,
                    ({ tech, key, repoName, org, branch, fileUrl, expected }) => {
                        updateStateDependencies(tech, key, repoName, org, branch, fileUrl);
                        expect(consoleLogMock).toHaveBeenCalledTimes(1)
                        expect(consoleErrorMock).toHaveBeenCalledTimes(0)
                        expect(STATE_DEPENDENCIES).toEqual(expected);
                    });

            test(`should throw an error based on wrong data passed to updateStateDependencies`, () => {
                const errMsg = 'This should not happen!';
                const err = new Error(errMsg);
                const mockData = mockStateDependenciesData[3];
                const { tech, key, repoName, org, branch, fileUrl } = mockData;

                STATE_DEPENDENCIES["node"] = mockData["expected"]["node"];

                expect(() => {
                    updateStateDependencies(tech, key, repoName, org, branch, fileUrl);
                }).toThrow(Error)

                expect(consoleErrorMock).toHaveBeenCalledTimes(1)

                expect(() => {
                    updateStateDependencies(tech, key, repoName, org, branch, fileUrl);
                }).toThrow(errMsg)

                expect(consoleLogMock).toHaveBeenCalledTimes(0)
                expect(consoleErrorMock).toHaveBeenCalledTimes(2)
            });
        });

        describe("getTechFile(...)", () => {

            test.each(mockTechData)
                (`should return related lang/tech and file order based on filename getTechFile($fileName)`,
                    ({ fileName, tech, key }) => {
                        expect(getTechFile(fileName)).toEqual({ tech, key });
                    });

            test(`should throw an error based on wrong filename getTechFile("any")`, () => {
                const errMsg = 'Error: fix DEPENDENCY_FILES object! File "any" has to be added.';
                const err = new Error(errMsg);
                expect(() => { getTechFile("any") }).toThrow(Error)
                expect(() => { getTechFile("any") }).toThrow(errMsg)
            });
        });

    });

    // ************************************************************ //
});
