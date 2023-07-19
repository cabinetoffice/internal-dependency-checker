const { writeFile, readFile, readdir } = require('node:fs/promises');
const path = require('node:path');

const GIT_REPORTS_FOLDER_NAME = process.argv[2];
const COMMITS_FILE_PATH = process.argv[3];
const TEAMS_FILE_NAME = process.argv[4];
const COMMITS = [];
const MEMBERS = {};
const REPOS = {};
const TEAMS = {};

const latestCommit = (timestamp1, timestamp2) => (timestamp1 > timestamp2) ? timestamp1 : timestamp2;

const updateMembers = (name, commit) => {
    if (MEMBERS[commit.email]) {
        MEMBERS[commit.email]["count"]++;
        MEMBERS[commit.email]["last"] = latestCommit(commit.timestamp, MEMBERS[commit.email]["last"]);
        if (MEMBERS[commit.email]["repos"].indexOf(name) === -1) {
            MEMBERS[commit.email]["repos"].push(name);
        }
    } else {
        MEMBERS[commit.email] = {
            "count": 1,
            "last": commit.timestamp,
            "repos": [name]
        };
    }
}

const updateRepos = (name, commit) => {
    REPOS[name]["last"] = latestCommit(commit.timestamp, REPOS[name]["last"]);
    if (REPOS[name]["members"].indexOf(commit.email) === -1) {
        REPOS[name]["members"].push(commit.email);
    }
}

const updateTeams = async () => {
    const data = await readFile(TEAMS_FILE_NAME, 'utf8');
    const jsonData = JSON.parse(data);
    const reposList = [];

    for (const [team, content] of Object.entries(jsonData)) {
        TEAMS[team] = { "last": "", "repo": "NA", "html_url": "" };

        for (const [key, repo] of Object.entries(content["repositories"])) {
            if (reposList.indexOf(repo.name) === -1) {
                reposList.push(repo.name);
            }
            if (REPOS[repo.name] && REPOS[repo.name]["last"] > TEAMS[team]["last"]) {
                TEAMS[team] = {
                    "last": REPOS[repo.name]["last"],
                    "repo": repo.name,
                    "html_url": repo.html_url
                };
            }
        }
    }

    const countRepos = Object.keys(REPOS).length;
    if (countRepos !== reposList.length) {
        TEAMS["NA"] = { "last": "", "repo": "NA", "html_url": "" };
        console.log(`${countRepos - reposList.length} unassigned repos.`);
    }
}

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

                for (const [name, commits] of Object.entries(jsonData)) {
                    REPOS[name] = { "members": [], "last": "" };
                    for (const commit of commits) {
                        if (commit.error) {
                            REPOS[name]["error"] = commit.error;
                        } else if (COMMITS.indexOf(commit.commit) === -1) {
                            COMMITS.push(commit.commit);
                            updateMembers(name, commit);
                            updateRepos(name, commit);
                        }
                    }
                };
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
}

init();