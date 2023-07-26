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

        if (repo.last) {
            const date = +repo.last;
            td[1].innerHTML = `Timestamp: ${date} <br> Date: ${new Date(date * 1000).toLocaleString('en-GB', { timeZone: 'UTC' })}`;
        } else {
            td[1].textContent = "N/A";
        }

        tbodyEl.appendChild(clone);
    }
}

(async () => {
        const commitsData = await getData(COMMITS_INFO_PATH);
        updateRepoCommitTable(commitsData);
})();