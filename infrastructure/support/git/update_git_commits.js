const { writeFile, readFile, readdir } = require('node:fs/promises');
const path = require('node:path');

const GIT_REPORTS_FOLDER_NAME = process.argv[2];

const init = async () => {
    try {
        const files = await readdir(GIT_REPORTS_FOLDER_NAME);
        const jsonFiles = files.filter(file => path.extname(file) === '.json');

        for (const file of jsonFiles) {
            console.log(`Remove duplicate commits from ${file}`);
            try {
                const filePath = path.join(GIT_REPORTS_FOLDER_NAME, file);
                const data = await readFile(filePath, 'utf8');
                const jsonData = JSON.parse(data);

                const content = Object.entries(jsonData)[0];
                const repoName = content[0];
                const commits = content[1];

                const repo = { [repoName]: [] };
                const uniqueObjects = [];

                for (const commit of commits) {
                    if (commit.error) {
                        repo[repoName].push(commit);
                    } else if (uniqueObjects.indexOf(commit.commit) === -1) {
                        uniqueObjects.push(commit.commit);
                        repo[repoName].push(commit);
                    }
                }

                await writeFile(filePath, JSON.stringify(repo));
            } catch (error) {
                console.error('Error parsing JSON:', file, error);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

init();
