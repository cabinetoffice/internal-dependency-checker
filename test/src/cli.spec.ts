jest.mock('../../src/scripts/main');
jest.mock('../../src/scripts/clone');
jest.mock('../../src/scripts/state');
jest.mock('../../src/utils/logger', () => ({
    log: {
        error: jest.fn(),
        info: jest.fn()
    }
}));

import { describe, expect, test, jest, afterEach } from '@jest/globals';

import { MOCK_ORGANIZATION } from '../mock/repos_info';

import { main } from "../../src/scripts/main";
import { clone } from "../../src/scripts/clone";
import { state } from "../../src/scripts/state";
import { cloneCommand, mainCommand, stateCommand } from "../../src/cli";

import { log } from '../../src/utils/logger';

const mockLogInfo = log.info as jest.Mock;
const mockLogError = log.error as jest.Mock;

const mockMainCall = main as jest.Mock;
const mockCloneCall = clone as jest.Mock;
const mockStateCall = state as jest.Mock;

describe("CLI tests suites", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should exec mainCommand with empty argv', () => {
        mainCommand({});

        expect(mockMainCall).toHaveBeenCalledTimes(0);

        expect(mockLogInfo).toHaveBeenCalledWith('Start main command!');
        expect(mockLogError).toHaveBeenCalledWith('ORG and/or GITHUB_KEY are missing!');
    });

    test('should exec mainCommand with ORG field', () => {
        const mockArgv = { ORG: MOCK_ORGANIZATION };
        mainCommand(mockArgv);

        expect(mockMainCall).toHaveBeenCalledTimes(1);
        expect(mockMainCall).toHaveBeenCalledWith(mockArgv.ORG);

        expect(mockLogInfo).toHaveBeenCalledTimes(1);
        expect(mockLogInfo).toHaveBeenCalledWith('Start main command!');
        expect(mockLogError).toHaveBeenCalledTimes(0);
    });

    test('should exec cloneCommand', () => {
        cloneCommand();

        expect(mockCloneCall).toHaveBeenCalledTimes(1);
        expect(mockCloneCall).toHaveBeenCalledWith();

        expect(mockLogInfo).toHaveBeenCalledTimes(1);
        expect(mockLogInfo).toHaveBeenCalledWith('Start clone command!');
        expect(mockLogError).toHaveBeenCalledTimes(0);
    });

    test('should exec stateCommand', () => {
        stateCommand();

        expect(mockStateCall).toHaveBeenCalledTimes(1);
        expect(mockStateCall).toHaveBeenCalledWith();

        expect(mockLogInfo).toHaveBeenCalledTimes(1);
        expect(mockLogInfo).toHaveBeenCalledWith('Start state command!');
        expect(mockLogError).toHaveBeenCalledTimes(0);
    });
});