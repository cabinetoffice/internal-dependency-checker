const setTableContent = (template, tbodyEl, name, description, memberContent, repositorieContent) => {
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");

    td[0].textContent = name;
    td[1].textContent = description
    td[2].appendChild(memberContent);
    td[3].appendChild(repositorieContent);

    tbodyEl.appendChild(clone);
}

const updateTable = (reposInfo) => {
    let unassignedRepos = reposInfo["repos"]["list"];
    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    const template = document.querySelector('#table-template');

    reposInfo["teams"]["list"].forEach(teamName => {
        const teamData = reposInfo["teams"]["details"][teamName];
        const memberContent = createTableContentDetails(
            `${teamData["members"].length} member/s`,
            mapTableContent(teamData["members"], reposInfo["members"]["details"])
        );
        const repositorieContent = createTableContentDetails(
            `${teamData["repos"].length} repository/ies`,
            mapTableContent(teamData["repos"], reposInfo["repos"]["details"])
        );
        const description = teamData["description"] || "";

        setTableContent(template, tbodyEl, teamName, description, memberContent, repositorieContent);

        unassignedRepos = unassignedRepos.filter(x => !teamData["repos"].includes(x));
    });

    const description = "Unassigned Repositories";
    const memberContent = createTableContentDetails("0 member/s", mapTableContent([], ""));
    const repositorieContent = createTableContentDetails(
        `${unassignedRepos.length} repository/ies`, mapTableContent(unassignedRepos, reposInfo["repos"]["details"])
    );

    setTableContent(template, tbodyEl, "_N/A", description, memberContent, repositorieContent);

    inputFilter = document.getElementById("search_table");
    inputFilter.oninput = searchTable;
}

(async () => {
    updateTable(
        await loadFile(REPOS_INFO_PATH)
    );
})()