const createRepoScatterChart = (repos) => {

    const repoScatterChartData = repos.map(repo => ({
        name: repo.name,
        x: repo.created_at,
        y: repo.updated_at
    }));

    const config = {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Date created vs last updated',
                data: repoScatterChartData,
                borderColor: 'red',
                backgroundColor: 'red',
            }],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Dates of Repositories created vs last updated',
                    font: {
                        size: 24
                    },
                },
                tooltip: {
                    mode: 'index',
                    callbacks: {
                        label: (context) => {
                            const repoName = context.dataset.data[context.dataIndex].name;
                            return `Repository: ${repoName}`;
                        }
                    }
                },
            },
            scales: {
                x: {
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
            },
        },
    };

    const ctx = document.getElementById('repos-scatter-chart').getContext('2d');
    new Chart(ctx, config);
}

(async () => {
    const reposData = await getRepos();
    const reposChartData = reposData.map(extractRepoVisualisationData);
    createRepoScatterChart(reposChartData);
})()
