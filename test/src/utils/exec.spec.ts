import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';

import { exec_command } from '../../../src/utils/exec';

const spyConsoleLog = jest.spyOn(console, 'log');
const spyConsoleError = jest.spyOn(console, 'error');

describe("UTILS exec tests suites", () => {

    beforeEach(() => {
        spyConsoleLog.mockImplementation(() => {/**/});
        spyConsoleError.mockImplementation(() => {/**/});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should call execPromise and print logs', async () => {
        await exec_command("ls", 5, 99);

        expect(spyConsoleLog).toHaveBeenCalledTimes(3);
        expect(spyConsoleLog).toHaveBeenCalledWith(`5/99 - execute command: ls`);
        expect(spyConsoleLog).toHaveBeenCalledWith("stdout:", expect.anything());
        expect(spyConsoleLog).toHaveBeenCalledWith("stderr:", expect.anything());
        expect(spyConsoleError).toHaveBeenCalledTimes(0);
    });

});
