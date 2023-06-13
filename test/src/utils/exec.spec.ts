import { describe, expect, test, jest, afterEach, beforeEach } from '@jest/globals';
import { SpiedFunction } from 'jest-mock';

import { exec_command } from '../../../src/utils/exec';

let consoleLogMock: SpiedFunction;
let consoleErrorMock: SpiedFunction;

describe("UTILS exec tests suites", () => {

    beforeEach(() => {
        consoleLogMock = jest.spyOn(console, 'log').mockImplementation( () => {} );
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation( () => {} );
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should call execPromise and print logs', async () => {
        await exec_command("ls", 5, 99)

        expect(consoleLogMock).toHaveBeenCalledTimes(3);
        expect(consoleLogMock).toHaveBeenCalledWith(`5/99 - execute command: ls`);
        expect(consoleLogMock).toHaveBeenCalledWith("stdout:", expect.anything());
        expect(consoleLogMock).toHaveBeenCalledWith("stderr:", expect.anything());
        expect(consoleErrorMock).toHaveBeenCalledTimes(0);
    });

});