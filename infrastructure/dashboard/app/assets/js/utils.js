/** CHART */

const sorting = (ascending, key) => {
    return (ascending) ? (a, b) => a[key] - b[key] : (a, b) => b[key] - a[key];
}

const sortChartData = async (file, ascending = true, key = "members") => {
    const data = await loadFile(file);
    const response = [];

    data["teams"]["list"].forEach( teamName => {
        const numMembers = data["teams"]["details"][teamName]["members"].length;
        const numRepos = data["teams"]["details"][teamName]["repos"].length;
        response.push({
            label: teamName,
            members: numMembers,
            repos: numRepos,
        });
    });

    return response.sort(sorting(ascending, key));
}

const setChartData = async () => {
    const teams = await sortChartData(REPOS_INFO_PATH, false);

    const labels = [];
    const members = [];
    const repos = [];

    teams.forEach(team => {
        labels.push(team.label);
        members.push(team.members);
        repos.push(team.repos);
    });

    return { labels, members, repos };
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

const mapTableContent = (iterator, content) => {
    const ul = document.createElement('ul');
    for (const name of iterator) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${content[name]["html_url"]}">${name}</a>`;
        ul.appendChild(li);
    }
    return ul
}

const searchTable = () => {
    // Declare variables
    let filter, table, tr, i, innerText;
    filter = inputFilter.value;
    table = document.getElementById("sortable_table");
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