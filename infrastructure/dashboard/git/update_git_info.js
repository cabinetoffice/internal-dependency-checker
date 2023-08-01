const { writeFile, readFile, readdir } = require('node:fs/promises');
const path = require('node:path');

const GIT_REPORTS_FOLDER_NAME = process.argv[2];
const COMMITS_FILE_PATH = process.argv[3];
const REPOS_INFO_FILE_NAME = process.argv[4];

const MEMBERS = {};
const REPOS = {};
const TEAMS = {};

const addUniqueElement = (array, item) => {
    if (array.indexOf(item) === -1) { array.push(item); }
};

const updateMembers = (name, commit) => {
    const timestamp = commit.timestamp;
    if (MEMBERS[commit.email]) {
        if (timestamp > MEMBERS[commit.email]["last_commit"]) {
            MEMBERS[commit.email]["last_commit"] = timestamp;
            MEMBERS[commit.email]["last_repo"] = name;
        }
        addUniqueElement(MEMBERS[commit.email]["repos"], name);
    } else {
        MEMBERS[commit.email] = { "last_commit": timestamp, "last_repo": name, "repos": [name] };
    }
};

const updateRepos = (name, commit) => {
    if (commit.timestamp > REPOS[name]["last_commit"]) {
        REPOS[name]["last_commit"] = commit.timestamp;
        REPOS[name]["last_member"] = commit.email;
    }
    addUniqueElement(REPOS[name]["members"], commit.email);
};

const updateTeams = async () => {
    const data = await readFile(REPOS_INFO_FILE_NAME, 'utf8');
    const jsonData = JSON.parse(data);
    const teamData = jsonData["teams"];

    const reposAssigned = [];

    for (const team of teamData["list"]) {
        TEAMS[team] = { "last_member": "N/A", "last_repo": "N/A", "last_commit": "" };
        for (const repo of teamData["details"][team]["repos"]) {
            // Unfortunately, so far has been impossible to have the last commit done by the members in the team.
            // There is no direct association between a member's login and the different activities that the user
            // is interacting with on GitHub (eg. `GITHUB` user, `user@*.local` email, `*@users.noreply.github.com` email ...)
            // Reference: https://git-scm.com/docs/git-log#Documentation/git-log.txt-emaNem
            // The last commit done by the team is linked to the last commit done on the repositories assigned to the team.
            if (REPOS[repo] && REPOS[repo]["last_commit"] > TEAMS[team]["last_commit"]) {
                TEAMS[team] = {
                    "last_member": REPOS[repo]["last_member"],
                    "last_repo": repo,
                    "last_commit": REPOS[repo]["last_commit"]
                };
            }
            addUniqueElement(reposAssigned, repo);
        }
    }

    const reposLength = Object.keys(REPOS).length;
    if (reposLength !== reposAssigned.length) {
        TEAMS["N/A"] = { "last_member": "N/A", "last_repo": "N/A", "last_commit": "" };
        console.log(`${reposLength - reposAssigned.length} unassigned repos.`);
    }
};

const init = async () => {
    try {
        const files = await readdir(GIT_REPORTS_FOLDER_NAME);
        const jsonFiles = files.filter(file => path.extname(file) === '.json');

        for (const file of jsonFiles) {
            console.log(`Update commits info file with ${file} commits`);
            try {
                const filePath = path.join(GIT_REPORTS_FOLDER_NAME, file);
                const data = await readFile(filePath, 'utf8');
                const jsonData = JSON.parse(data);

                const content = Object.entries(jsonData)[0];
                const repoName = content[0];
                const commits = content[1];

                REPOS[repoName] = { "members": [], "last_commit": "", "last_member": "" };

                for (const commit of commits) {
                    if (commit.error) {
                        REPOS[repoName]["error"] = commit.error;
                    } else {
                        updateMembers(repoName, commit);
                        updateRepos(repoName, commit);
                    }
                }
            } catch (error) {
                REPOS[file] = { "error": `${error.message}` };
                console.error('Error parsing JSON:', file, error);
            }
        }

        await updateTeams();

        await writeFile(COMMITS_FILE_PATH, JSON.stringify({ REPOS, MEMBERS, TEAMS }));
    } catch (error) {
        console.error('Error:', error);
    }
};

init();
