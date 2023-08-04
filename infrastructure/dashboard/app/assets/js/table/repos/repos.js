const setReposTableContent = (template, tbodyEl, repoName, repoDetails) => {
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");
    const a = clone.querySelector("a");

    a.textContent = repoName;
    a.href = repoDetails.html_url;

    td[1].textContent = repoDetails.description ? repoDetails.description : "N/A";
    td[2].textContent = new Date(repoDetails.created_at).getFullYear();
    td[3].textContent = repoDetails.archived ? "Yes" : "No";
    td[4].textContent = repoDetails.visibility;

    tbodyEl.appendChild(clone);
};
const updateReposTable = (repos) => {
    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    const template = document.querySelector('#table-template');

    repos.list.forEach((repo) => {
        setReposTableContent(template, tbodyEl, repo, repos.details[repo]);
    });

    inputFilter = document.getElementById("repos_table");
    inputFilter.oninput = searchTable;
};

(async () => {
    const { repos } = await loadFile(REPOS_INFO_PATH);
        updateReposTable(
            repos
        );
})();
