import { init } from "./init.js";
import { ORGANIZATION, GITHUB_KEY } from "./config.js";

if (ORGANIZATION && GITHUB_KEY) {
    init();
} else {
    if (!ORGANIZATION) {
        console.error(`GitHub organization is missing`);
    }
    if (!GITHUB_KEY) {
        console.error(`Access Token/Github key is missing`);
    }
}
