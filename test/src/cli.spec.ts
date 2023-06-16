jest.mock('../../src/scripts/main');
jest.mock('../../src/scripts/clone');
jest.mock('../../src/scripts/state');

import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import { MOCK_ORGANIZATION } from '../mock/repos_info';

import { main } from "../../src/scripts/main";
import { clone } from "../../src/scripts/clone";
import { state } from "../../src/scripts/state";
import { cloneCommand, mainCommand, stateCommand } from "../../src/cli";

const spyConsoleLog = jest.spyOn(console, 'log');
const spyConsoleError = jest.spyOn(console, 'error');

const mockMainCall = main as jest.Mock;
const mockCloneCall = clone as jest.Mock;
const mockStateCall = state as jest.Mock;

describe("CLI tests suites", () => {

    beforeEach(() => {
        spyConsoleLog.mockImplementation(() => {/**/});
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should exec mainCommand with empty argv', () => {
        mockMainCall.mockReturnValueOnce(() => Promise.resolve({}));
        mainCommand({});

        expect(mockMainCall).toHaveBeenCalledTimes(0);

        expect(spyConsoleLog).toHaveBeenCalledWith('Start main command!');
        expect(spyConsoleError).toHaveBeenCalledWith('ORG and/or GITHUB_KEY are missing!');
    });

    test('should exec mainCommand with ORG field', () => {
        mockMainCall.mockReturnValueOnce(() => Promise.resolve({}));
        const mockArgv = { ORG: MOCK_ORGANIZATION };
        mainCommand(mockArgv);

        expect(mockMainCall).toHaveBeenCalledTimes(1);
        expect(mockMainCall).toHaveBeenCalledWith(mockArgv.ORG);

        expect(spyConsoleLog).toHaveBeenCalledTimes(1);
        expect(spyConsoleLog).toHaveBeenCalledWith('Start main command!');
        expect(spyConsoleError).toHaveBeenCalledTimes(0);
    });

    test('should exec cloneCommand', () => {
        mockCloneCall.mockReturnValueOnce(() => Promise.resolve({}));
        cloneCommand();
        expect(mockCloneCall).toHaveBeenCalledTimes(1);
        expect(mockCloneCall).toHaveBeenCalledWith();

        expect(spyConsoleLog).toHaveBeenCalledTimes(1);
        expect(spyConsoleLog).toHaveBeenCalledWith('Start clone command!');
        expect(spyConsoleError).toHaveBeenCalledTimes(0);
    });

    test('should exec stateCommand', () => {
        mockStateCall.mockReturnValueOnce(() => Promise.resolve({}));
        stateCommand();
        expect(mockStateCall).toHaveBeenCalledTimes(1);
        expect(mockStateCall).toHaveBeenCalledWith();

        expect(spyConsoleLog).toHaveBeenCalledTimes(1);
        expect(spyConsoleLog).toHaveBeenCalledWith('Start state command!');
        expect(spyConsoleError).toHaveBeenCalledTimes(0);
    });
});
