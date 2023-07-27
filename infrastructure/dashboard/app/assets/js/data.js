const TEAMS_PATH = "../../assets/data/teams.json";
const COMMITS_INFO_PATH = "../../assets/data/commits_info.json";
const REPOS_INFO_PATH = "../../assets/data/repos_info.json";

const loadFile = async (file) => {
    try {
        const response = await fetch(file);
        return await response.json();
    } catch ( _ ) {
        console.error("There has been a problem with loading file.");
        return {};
    }
}

const getData = async (file) => {
    return await loadFile(file);
}
