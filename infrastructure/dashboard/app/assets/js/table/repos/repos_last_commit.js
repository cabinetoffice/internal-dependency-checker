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

        if (repo.last_commit) {
            const date = +repo.last_commit;
            td[1].innerHTML = `Timestamp: ${date} <br> Date: ${new Date(date * 1000).toLocaleString('en-GB', { timeZone: 'UTC' })}`;
        } else {
            td[1].textContent = "N/A";
        }

        tbodyEl.appendChild(clone);
    }
    inputFilter = document.getElementById("repos_last_commit_table");
    inputFilter.oninput = searchTable;
}

(async () => {
    updateRepoCommitTable(await getData(COMMITS_INFO_PATH));
})();
