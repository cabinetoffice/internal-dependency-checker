const updateRepoCommitTable = (commitsData) => {

    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    const template = document.querySelector('#table-template');

    for (const [name, repo] of Object.entries(commitsData["REPOS"])) {
        const clone = template.content.cloneNode(true);
        const td = clone.querySelectorAll("td");
        td[0].textContent = name;

        const memberContent = createTableContentDetails(
            `${repo["members"].length} contributor/s`,
            mapTableContent(repo["members"], null, false)
        );
        td[1].appendChild(memberContent);

        if (repo.last_commit) {
            const date = +repo.last_commit;
            td[2].innerHTML = `Timestamp: ${date} <br> Date: ${new Date(date * 1000).toLocaleString('en-GB', { timeZone: 'UTC' })}`;
        } else {
            td[2].textContent = "N/A";
        }

        tbodyEl.appendChild(clone);
    }
    inputFilter = document.getElementById("search_table");
    inputFilter.oninput = searchTable;
}

(async () => {
    updateRepoCommitTable(await getData(COMMITS_INFO_PATH));
})();
