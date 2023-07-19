const setTableContent = (template, tbodyEl, name, description, memberContent, repositorieContent) => {
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");

    td[0].textContent = name;
    td[1].textContent = description
    td[2].appendChild(memberContent);
    td[3].appendChild(repositorieContent);

    tbodyEl.appendChild(clone);
}

const updateTable = (teams, repos) => {
    const tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    const template = document.querySelector('#table-template');

    for (const [name, content] of Object.entries(teams)) {
        const memberContent = createTableContentDetails(
            `${Object.keys(content["members"]).length} member/s`,
            mapTableContent(content["members"], "login")
        );
        const repositorieContent = createTableContentDetails(
            `${Object.keys(content["repositories"]).length} repository/ies`,
            mapTableContent(content["repositories"], "name")
        );
        const description = content.description || "";

        setTableContent(template, tbodyEl, name, description, memberContent, repositorieContent);

        (Object.entries(content["repositories"])).forEach( e => {
            repos = repos.filter( r => r.name !== e[1].name );
        });
    }

    const description = "Unassigned Repositories";
    const memberContent = createTableContentDetails( "0 member/s", mapTableContent([], ""));
    const repositorieContent = createTableContentDetails(
        `${repos.length} repository/ies`, mapTableContent(repos, "name")
    );

    setTableContent(template, tbodyEl, "_NA", description, memberContent, repositorieContent);

    inputFilter = document.getElementById("search_team");
    inputFilter.oninput = searchTable;
}

(async () => {
    updateTable(
        await getData(TEAMS_PATH),
        await getRepos()
    );
})()