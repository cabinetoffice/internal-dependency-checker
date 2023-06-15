
import { promisify } from "node:util";
import { exec } from "node:child_process";
const execPromise = promisify(exec);

export const exec_command = async (command: string, index: number, length: number): Promise<void> => {
    try {
        console.log(`${index}/${length} - execute command: ${command}`);

        const { stdout, stderr } = await execPromise(command);

        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
