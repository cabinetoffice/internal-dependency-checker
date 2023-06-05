
import { promisify } from "node:util";
import { exec } from "node:child_process";
const execPromise = promisify(exec);

export const exec_command = async (command, index, length) => {
    try {
        console.log(`${index}/${length} - execute command: ${command}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error(`command execution: ${stderr}`);
        }

        console.log(stdout);
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);
    }
}