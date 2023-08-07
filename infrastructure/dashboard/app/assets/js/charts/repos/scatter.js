const createRepoScatterChart = (repos, reposCommits) => {

    const repoScatterChartData = repos.list
    .filter( repo => reposCommits[repo].last_commit !== "" )
    .map(repo => ({
        name: repo,
        x: repos.details[repo].created_at,
        y: +reposCommits[repo].last_commit * 1000
    }));

    const config = {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Date created vs last updated',
                data: repoScatterChartData,
                borderColor: 'red',
                backgroundColor: 'red'
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Dates of Repositories created vs last updated',
                    font: {
                        size: 24
                    }
                },
                tooltip: {
                    mode: 'index',
                    callbacks: {
                        label: (context) => {
                            const repoName = context.dataset.data[context.dataIndex].name;
                            return `Repository: ${repoName}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        stepSize: 6,
                        displayFormats: {
                            month: 'MMM yyyy'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date created',
                        font: {
                            size: 18
                        }
                    }
                },
                y: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        stepSize: 6,
                        displayFormats: {
                            month: 'MMM yyyy',
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date last updated',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    };

    const ctx = document.getElementById('repos-scatter-chart').getContext('2d');
    new Chart(ctx, config);
}

(async () => {
    const reposCommitsData = await getData(COMMITS_INFO_PATH);
    const reposInfo = await loadFile(REPOS_INFO_PATH);
    createRepoScatterChart(reposInfo["repos"], reposCommitsData["REPOS"]);
})()
