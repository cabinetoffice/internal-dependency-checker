const sortRepositoriesChartData = async (ascending = true, key = "data2") => {
    const data = await loadFile(REPOS_INFO_PATH);
    const response = [];

    data["repos"]["list"].forEach( repoName => {
        const numTeams = data["repos"]["details"][repoName]["teams"].length;
        const numMembers = data["repos"]["details"][repoName]["members"].length;
        response.push({ label: repoName, data1: numTeams, data2: numMembers });
    });

    return response.sort(sorting(ascending, key));
}

(async () => {
    const reposData = await sortRepositoriesChartData(false);
    const reposStackedData = await setChartData(reposData);

    const title = "Stacked Bar Chart with Teams and Members per Repos (ordered by teams)";
    const label1 = "# of Teams";
    const label2 = "# of Members";

    stackedBarChart(reposStackedData, title, label1, label2, "stacked_chart");
})()
