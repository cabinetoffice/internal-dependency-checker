const setReposTableContent = (template, tbodyEl, visualisationData) => {
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");
    const a = clone.querySelector("a");

    a.textContent = visualisationData.name;
    a.href = visualisationData.html_url;

    td[1].textContent = visualisationData.description ? visualisationData.description : "N/A";
    td[2].textContent = new Date(visualisationData.created_at).getFullYear();
    td[3].textContent = visualisationData.archived ? "Yes" : "No";
    td[4].textContent = visualisationData.visibility;

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
