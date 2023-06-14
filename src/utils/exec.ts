
import { promisify } from "node:util";
import { exec } from "node:child_process";
const execPromise = promisify(exec);

export const exec_command = async (command: string, index: number, length: number) => {
    try {
        console.log(`${index}/${length} - execute command: ${command}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error(`Error: ${stderr}`);
        }

        console.log(stdout);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};
