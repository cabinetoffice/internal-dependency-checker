const chartOptions =  {
    plugins: {
        title: {
            display: true,
            text: 'Stacked Bar Chart with Members and Repositories per Team (ordered by members)',
            font: {
                size: 24
            }
        
        },
        legend: {
            labels: {
                font: {
                    size: 12
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

const chartOptionsData = (data) => {
    return {
        labels: data.labels,
        datasets: [
            {
                label: '# of Members',
                data: data.members,
                backgroundColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
                stack: 'Stack 0'
            },
            {
                label: '# of Repositories',
                data: data.repos,
                backgroundColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                stack: 'Stack 0'
            }
        ]
    }
};

const stackedBarChart = (data, id) => {
    const ctx = document.getElementById(id);
    new Chart(ctx, {
        type: 'bar',
        data: chartOptionsData(data),
        options: chartOptions
    });
}

(async () => {
    const teamsStackedData = await setChartData();
    stackedBarChart(teamsStackedData, "teams_stacked_chart");
})()
