const updateTable = (commitsData, reposInfoData) => {
    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    const template = document.querySelector('#table-template');

    for (const [name, content] of Object.entries(commitsData["TEAMS"])) {
        const clone = template.content.cloneNode(true);
        const td = clone.querySelectorAll("td");
        td[0].textContent = name;

        if(content.last_commit){
            const date = +content.last_commit;
            const repoUrl = reposInfoData["repos"]["details"][content.last_repo]["html_url"];
            td[1].innerHTML = `<a href="${repoUrl}">${content.last_repo}</a>`;
            td[2].innerHTML = `${content.last_member}`;
            td[3].innerHTML = `Timestamp: ${date} <br> Date: ${new Date( date * 1000 ).toLocaleString('en-GB', { timeZone: 'UTC' })}`;
        } else {
            td[1].textContent = "N/A";
            td[2].textContent = "N/A";
            td[3].textContent = "N/A";
        }

        tbodyEl.appendChild(clone);
    }
    inputFilter = document.getElementById("search_table");
    inputFilter.oninput = searchTable;
}

(async () => {
    const reposInfoData = await loadFile(REPOS_INFO_PATH)
    const commitsData = await getData(COMMITS_INFO_PATH);
    updateTable(commitsData, reposInfoData);
})()