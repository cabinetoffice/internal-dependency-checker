const sortTeamsChartData = async (ascending = true, key = "data1") => {
    const data = await loadFile(REPOS_INFO_PATH);
    const response = [];

    data["teams"]["list"].forEach(teamName => {
        const numMembers = data["teams"]["details"][teamName]["members"].length;
        const numRepos = data["teams"]["details"][teamName]["repos"].length;
        response.push({ label: teamName, data1: numMembers, data2: numRepos });
    });

    return response.sort(sorting(ascending, key));
}

(async () => {
    const teamsData = await sortTeamsChartData(false);
    const teamsStackedData = await setChartData(teamsData);

    const title = "Stacked Bar Chart with Members and Repositories per Team (ordered by members)";
    const label1 = "# of Members";
    const label2 = "# of Repositories";

    stackedBarChart(teamsStackedData, title, label1, label2, "stacked_chart");
})()
