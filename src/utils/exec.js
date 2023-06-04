
import { promisify } from "node:util";
import { exec } from "node:child_process";
const execPromise = promisify(exec);

export const exec_command = async (command) => {
    try {
        console.log(`Execute Command: ${command}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error(`Command execution: ${stderr}`);
        }

        console.log(`Command output: ${stdout}`);
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);
    }
}