const TEAMS_PATH = "./assets/data/teams.json";
const COMMITS_INFO_PATH = "./assets/data/commits_info.json";
const REPOS_INFO_PATH = "./assets/data/repos_info.json";

const DATA = { repos: {}, members: {}, teams: {}, commits: {} };

const loadFile = async (file) => {
    try {
        const response = await fetch(file);
        return await response.json();
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
        return {};
    }
}

const mapData = (repos, teams, commits) => {
    // TBD
}

const getData = async () => {
    const REPOS_INFO_DATA = await loadFile(REPOS_INFO_PATH);
    const TEAMS_DATA = await loadFile(TEAMS_PATH);
    const COMMITS_INFO_DATA = await loadFile(COMMITS_INFO_PATH);

    return mapData(REPOS_INFO_DATA, TEAMS_DATA, COMMITS_INFO_DATA);
}

(async () => {
    await getData();
})();
