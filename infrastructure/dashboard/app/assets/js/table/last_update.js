const updateTable = (commitsData) => {
    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    const template = document.querySelector('#table-template');

    for (const [name, repo] of Object.entries(commitsData["TEAMS"])) {
        const clone = template.content.cloneNode(true);
        const td = clone.querySelectorAll("td");
        td[0].textContent = name;

        if(repo.last){
            const date = +repo.last;
            td[1].innerHTML = `<a href="${repo["html_url"]}">${repo.repo}</a>`;
            td[2].innerHTML = `Timestamp: ${date} <br> Date: ${new Date( date * 1000 ).toLocaleString('en-GB', { timeZone: 'UTC' })}`;
        } else {
            td[1].textContent = "NA";
            td[2].textContent = "NA";
        }

        tbodyEl.appendChild(clone);
    }
    inputFilter = document.getElementById("search_team");
    inputFilter.oninput = searchTable;
}

(async () => {
    const commitsData = await getData(COMMITS_INFO_PATH);
    updateTable(commitsData);
})()