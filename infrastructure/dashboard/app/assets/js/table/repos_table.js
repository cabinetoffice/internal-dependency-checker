const setReposTableContent = (template, tbodyEl, visualisationData) => {
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");
    const a = clone.querySelector("a");

    a.textContent = visualisationData.name;
    a.href = visualisationData.htmlUrl;

    td[1].textContent = visualisationData.description ? visualisationData.description : "No description provided";
    td[2].textContent = new Date(visualisationData.created_at).getFullYear();
    td[3].textContent = new Date(visualisationData.updated_at).getFullYear();
    td[4].textContent = visualisationData.language ? visualisationData.language : "No main language";
    td[5].textContent = visualisationData.fork ? 'Yes' : "No";
    td[6].textContent = visualisationData.archived ? "Yes" : "No";
    td[7].textContent = visualisationData.visibility;

    tbodyEl.appendChild(clone);
};

const updateReposTable = (repos) => {
    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    const template = document.querySelector('#table-template');

    const createRepoTable = repos.map((repoData) => {
        const visualisationData = extractRepoVisualisationData(repoData);
        setReposTableContent(template, tbodyEl, visualisationData);
    })

    inputFilter = document.getElementById("search_team");
    inputFilter.oninput = searchTable;
};

(async () => {
        updateReposTable(
            await getRepos()
        );
})();
