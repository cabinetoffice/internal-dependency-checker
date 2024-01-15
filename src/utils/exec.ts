import { promisify } from "node:util";
import { exec } from "node:child_process";
import { log } from "./logger";

const execPromise = promisify(exec);

export const exec_command = async (command: string, index: number, length: number): Promise<void> => {
    try {
        log.info(`${index}/${length} - execute command: ${command}`);

        const { stdout, stderr } = await execPromise(command);

        log.info(`stdout: ${stdout}`);
        log.info(`stderr: ${stderr}`);
    } catch (error: any) {
        log.error(`Error: ${error.message}`);
    }
};
