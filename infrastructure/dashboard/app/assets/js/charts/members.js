const sortMembersChartData = async (ascending = true, key = "data2") => {
    const data = await loadFile(REPOS_INFO_PATH);
    const response = [];

    data["members"]["list"].forEach( memberName => {
        const numTeams = data["members"]["details"][memberName]["teams"].length;
        const numRepos = data["members"]["details"][memberName]["repos"].length;
        response.push({ label: memberName, data1: numTeams, data2: numRepos });
    });

    return response.sort(sorting(ascending, key));
}

(async () => {
    const membersData = await sortMembersChartData(false);
    const membersStackedData = await setChartData(membersData);

    const title = "Stacked Bar Chart with Teams and Repositories per Members (ordered by repos)";
    const label1 = "# of Teams";
    const label2 = "# of Repositories";

    stackedBarChart(membersStackedData, title, label1, label2, "stacked_chart");
})()
