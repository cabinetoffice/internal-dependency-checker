const setReposTableContent = (template, tbodyEl, repoName, repoDetails, commitsData) => {
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");
    const a = clone.querySelector("a");

    a.textContent = repoName;
    a.href = repoDetails.html_url;

    const createAtYear = new Date(repoDetails.created_at).getFullYear();
    let lastCommitYear = "N/A";

    if(commitsData["REPOS"][repoName]["last_commit"] === "") {
        lastCommitYear = commitsData["REPOS"][repoName]["error"];
    } else {
        const tmpYear = new Date(+commitsData["REPOS"][repoName]["last_commit"]*1000).getFullYear();
        if (tmpYear >= createAtYear) { lastCommitYear = tmpYear; }
    }

    td[1].textContent = repoDetails.description ? repoDetails.description : "N/A";
    td[2].textContent = createAtYear;
    td[3].textContent = lastCommitYear;
    td[4].textContent = repoDetails.archived ? "Yes" : "No";
    td[5].textContent = repoDetails.visibility;

    tbodyEl.appendChild(clone);
};

const updateReposTable = (repos, commitsData) => {
    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    const template = document.querySelector('#table-template');

    repos.list.forEach((repo) => {
        setReposTableContent(template, tbodyEl, repo, repos.details[repo], commitsData);
    });

    inputFilter = document.getElementById("search_table");
    inputFilter.oninput = searchTable;
};

(async () => {
    const commitsData = await getData(COMMITS_INFO_PATH);
    const { repos } = await loadFile(REPOS_INFO_PATH);
    updateReposTable(repos, commitsData);
})();
