const setTableContent = (template, tbodyEl, name, teamContent, repositorieContent) => {
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");

    td[0].textContent = name;
    td[1].appendChild(teamContent);
    td[2].appendChild(repositorieContent);

    tbodyEl.appendChild(clone);
}

const updateTable = (reposInfo) => {
    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }

    const template = document.querySelector('#table-template');

    reposInfo["members"]["list"].forEach(member => {
        const memberData = reposInfo["members"]["details"][member];
        const teamContent = createTableContentDetails(
            `${memberData["teams"].length} team/s`,
            mapTableContent(memberData["teams"], reposInfo["teams"]["details"])
        );
        const repositorieContent = createTableContentDetails(
            `${memberData["repos"].length} repository/ies`,
            mapTableContent(memberData["repos"], reposInfo["repos"]["details"])
        );

        setTableContent(template, tbodyEl, member, teamContent, repositorieContent);

    });

    inputFilter = document.getElementById("search_table");
    inputFilter.oninput = searchTable;

}

(async () => {
    updateTable(
        await loadFile(REPOS_INFO_PATH)
    );
})()