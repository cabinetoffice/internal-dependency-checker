const createRepoPiecharts = (repos) => {

    const reposForkedData = { forked: 0, not_forked: 0 };
    const reposArchivedData = { archived: 0, not_archived: 0 };
    const reposVisibilityData = { public: 0, private: 0 };

    repos.forEach(repo => {
        reposForkedData[repo.fork ? 'forked' : 'not_forked']++;
        reposArchivedData[repo.archived ? 'archived' : 'not_archived']++;
        reposVisibilityData[repo.visibility === 'public' ? 'public' : 'private']++;
    });

    const reposForkedCtx = document.getElementById('repos-forked-chart').getContext('2d');
    const reposArchivedCtx = document.getElementById('repos-archived-chart').getContext('2d');
    const reposVisibilityCtx = document.getElementById('repos-visibility-chart').getContext('2d');

    const reposForkedChart = new Chart(reposForkedCtx, {
        type: 'pie',
        data: {
            labels: ["Forked", "Not Forked"],
            datasets: [{
                data: Object.values(reposForkedData),
                backgroundColor: ['blue', 'gray'],
            }]
        },
        options: {
            responsive: false
        }
    });

    const reposArchivedChart = new Chart(reposArchivedCtx, {
        type: 'pie',
        data: {
            labels: ["Archived", "Not Archived"],
            datasets: [{
                data: Object.values(reposArchivedData),
                backgroundColor: ['orange', 'gray'],
            }]
        },
        options: {
            responsive: false
        }
    });

    const reposVisibilityChart = new Chart(reposVisibilityCtx, {
        type: 'pie',
        data: {
            labels: ["Public", "Private"],
            datasets: [{
                data: Object.values(reposVisibilityData),
                backgroundColor: ['green', 'red'],
            }]
        },
        options: {
            responsive: false
        }
    });

}

const languageBarChartOptions = {
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: 'Main languages of Repositories'
            }
        },
        y: {
            display: true,
            title: {
                display: true,
                text: 'Number of Repositories'
            }
        }
    }
};

const createRepoLanguageBarChart = (repos) => {

    const languagesData = repos.reduce((acc, repo) => {
        if (repo.language === null) {
            acc['No Main Language'] = acc['No Main Language'] + 1 || 1;
        } else {
            acc[repo.language] = acc[repo.language] + 1 || 1;
        }
        return acc;
    }, {});

    const languageCtx = document.getElementById('repos-language-chart').getContext('2d');

    const languageBarChart = new Chart(languageCtx, {
        type: "bar",
        data: {
            labels: Object.keys(languagesData),
            datasets: [{
                backgroundColor: 'rgb(75, 192, 192)',
                label: '# of Repositories',
                data: Object.values(languagesData)
            }]
        },
        options: languageBarChartOptions
    });

}

(async () => {
    const reposData = await getRepos();
    const reposChartData = reposData.map(extractRepoVisualisationData);
    createRepoPiecharts(reposChartData);
    createRepoLanguageBarChart(reposChartData);
})()
