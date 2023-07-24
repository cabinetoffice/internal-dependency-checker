const createPiecharts = (repos) => {

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

(async () => {
    const reposData = await getRepos();
    const reposChartData = reposData.map(extractRepoVisualisationData);
    createPiecharts(reposChartData);
})()
