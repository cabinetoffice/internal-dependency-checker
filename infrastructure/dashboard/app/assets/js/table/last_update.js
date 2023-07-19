const updateTable = (teamsData, commitsData) => {
    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    const template = document.querySelector('#table-template');

    for (const [name, content] of Object.entries(teamsData)) {
        const clone = template.content.cloneNode(true);
        const td = clone.querySelectorAll("td");
        td[0].textContent = name;

        td[1].textContent = "NA";
        td[2].textContent = "NA";

        for (const [key, repo] of Object.entries(content["repositories"])) {
            td[1].innerHTML = `<a href="${repo["html_url"]}">${repo.name}</a>`;;
            if (commitsData["REPO"] && commitsData["REPO"][repo.name] && commitsData["REPO"][repo.name]["last"]) {
                const date = +commitsData["REPO"][repo.name]["last"];
                td[2].innerHTML = `Timestamp: ${commitsData["REPO"][repo.name]["last"]} <br> Date: ${new Date( date * 1000 ).toLocaleString('en-GB', { timeZone: 'UTC' })}`;
            }
        }
        tbodyEl.appendChild(clone);
    }
    inputFilter = document.getElementById("search_team");
    inputFilter.oninput = searchTable;
}

(async () => {
    const teamsData = await getData(TEAMS_PATH);
    const commitsData = await getData(COMMITS_INFO_PATH);
    updateTable(teamsData, commitsData);
})()