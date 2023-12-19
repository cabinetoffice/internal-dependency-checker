jest.mock('../../../src/utils/logger', () => ({
    log: {
        info: jest.fn(),
        error: jest.fn()
    }
}));

import { describe, expect, test, jest, afterEach } from '@jest/globals';

import { exec_command } from '../../../src/utils/exec';

import { log } from "../../../src/utils/logger";

const mockLogError = log.error as jest.Mock;
const mockLogInfo = log.info as jest.Mock;

describe("UTILS exec tests suites", () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should call execPromise and print logs', async () => {
        await exec_command("ls", 5, 99);

        expect(mockLogInfo).toHaveBeenCalledTimes(3);
        expect(mockLogInfo).toHaveBeenCalledWith(`5/99 - execute command: ls`);
        expect(mockLogInfo).toHaveBeenCalledWith(expect.stringContaining("stdout: "));
        expect(mockLogInfo).toHaveBeenCalledWith(expect.stringContaining("stderr: "));
        expect(mockLogError).toHaveBeenCalledTimes(0);
    });

});
