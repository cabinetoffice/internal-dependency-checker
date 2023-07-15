import { writeFile, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const GIT_REPORTS_FOLDER_NAME = process.argv[2];
const DASHBOARD_REPORTS_FOLDER_NAME = process.argv[3];
const USER = {};
const REPO = {};
const COMMITS = [];

const updateUser = (name, commit) => {
    if (USER[commit.email]) {
        USER[commit.email]["count"]++;
        USER[commit.email]["last"] = (commit.timestamp > USER[commit.email]["last"]) ? commit.timestamp : USER[commit.email]["last"];
        if (USER[commit.email]["repo"].indexOf(name) === -1) {
            USER[commit.email]["repo"].push(name);
        }
    } else {
        USER[commit.email] = {
            "count": 1,
            "last": commit.timestamp,
            "repo": [name]
        };
    }
}
const updateRepo = (name, commit) => {
    REPO[name]["last"] = (commit.timestamp > REPO[name]["last"]) ? commit.timestamp : REPO[name]["last"];
    if (REPO[name]["members"].indexOf(commit.email) === -1) {
        REPO[name]["members"].push(commit.email);
    }
}

const init = async () => {
    try {
        const files = await readdir(GIT_REPORTS_FOLDER_NAME);
        const jsonFiles = files.filter(file => path.extname(file) === '.json');

        // Iterate in all json files
        for (const file of jsonFiles) {
            try {
                const filePath = path.join(GIT_REPORTS_FOLDER_NAME, file);
                const data = await readFile(filePath, 'utf8');
                const jsonData = JSON.parse(data);

                // Process the JSON data as needed
                for (const [name, commits] of Object.entries(jsonData)) {
                    REPO[name] = { "members": [], "last": "" };
                    for (const commit of commits) {
                        if (commit.error) {
                            REPO[name]["error"] = commit.error;
                        } else if (COMMITS.indexOf(commit.commit) === -1) {
                            COMMITS.push(commit.commit);
                            updateUser(name, commit);
                            updateRepo(name, commit);
                        }
                    }
                };
            } catch (error) {
                REPO[file] = { "error": `${error.message}` };
                console.error('Error parsing JSON:', file, error);
            }
        }

        await writeFile(`${DASHBOARD_REPORTS_FOLDER_NAME}/git_info.json`, JSON.stringify({ USER, REPO }));
    } catch (error) {
        console.error('Error:', error);
    }
}

init();