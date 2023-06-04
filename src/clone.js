import {
    read_and_clone_repo
} from "./utils/fs.js";

(async () => {
    try {
        console.log(`This script will likely take a few hours to complete, depending on the number of repositories and other factors (ratelimits ...)`);
        read_and_clone_repo();
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
})();