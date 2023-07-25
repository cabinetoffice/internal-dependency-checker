const TEAMS_PATH = "../../assets/data/teams.json";
const COMMITS_INFO_PATH = "../../assets/data/commits_info.json";
const REPOS_INFO_PATH = "../../assets/data/repos_info.json";

const loadFile = async (file) => {
    try {
        const response = await fetch(file);
        return await response.json();
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
        return {};
    }
}

const getData = async (file) => {
    return await loadFile(file);
}

const sorting = (ascending, key) => {
    return (ascending) ? (a, b) => a[key] - b[key] : (a, b) => b[key] - a[key];
}

const getRepos = async () => {
    const reposInfo = await loadFile(REPOS_INFO_PATH);
    return reposInfo["repos"];
}

/** CHART */

const sortChartData = async (file, ascending = true, key = "members") => {
    const data = await loadFile(file);
    const response = [];

    Object.entries(data).forEach(e => {
        const numMembers = Object.keys(e[1]["members"]).length;
        const numRepositories = Object.keys(e[1]["repositories"]).length;
        response.push({
            label: e[0],
            members: numMembers,
            repositories: numRepositories,
        });
    });

    return response.sort(sorting(ascending, key));
}

const setChartData = async () => {
    const teams = await sortChartData(TEAMS_PATH, false);

    const labels = [];
    const members = [];
    const repositories = [];

    teams.forEach(team => {
        labels.push(team.label);
        members.push(team.members);
        repositories.push(team.repositories);
    });

    return { labels, members, repositories };
}

/** TABLE */

const createTableContentDetails = (text, content) => {
    const details = document.createElement('details');

    const summary = document.createElement('summary');
    summary.innerHTML = `<span class="govuk-details__summary-text"> ${text} </span>`;

    const div = document.createElement('div');

    div.setAttribute("class", "govuk-details__text");
    div.appendChild(content);

    details.appendChild(summary);
    details.appendChild(div);

    return details;
}

const mapTableContent = (data, dataKey) => {
    const ul = document.createElement('ul');
    for (const [key, content] of Object.entries(data)) {
        const li = document.createElement('li');
        const liContent = (dataKey) ? content[dataKey] : content;
        li.innerHTML = `<a href="${content["html_url"]}">${liContent}</a>`;
        ul.appendChild(li);
    }
    return ul
}

const searchTable = () => {
    // Declare variables
    let filter, table, tr, i, innerText;
    filter = inputFilter.value;
    table = document.getElementById("teams_table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {
        innerText = tr[i].innerText;
        if (innerText) {
            if (innerText.indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

/** REPOS */

const extractRepoVisualisationData = (repoData) => {
    const propertiesToExtract = ["name", "html_url", "description", "created_at", "updated_at", "language", "fork", "archived", "visibility"];
    const visualisationData = propertiesToExtract.reduce((acc, property) => {
        acc[property] = repoData[property];
        return acc;
    }, {});
    return visualisationData;
}