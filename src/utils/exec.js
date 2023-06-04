
import { promisify } from "node:util";
import { exec } from "node:child_process";
const execPromise = promisify(exec);

export const exec_command = async (command) => {
    console.log(`Execute Command: ${command}`);
    try {
        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error(`Command execution encountered an error: ${stderr}`);
        }

        console.log(`Command output: ${stdout}`);
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);
    }
}