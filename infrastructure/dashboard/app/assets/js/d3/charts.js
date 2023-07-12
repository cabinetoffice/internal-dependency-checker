const forceGraphEl = document.getElementById('teams_bar_chart');

function refreshGraph() {
    if(forceGraphEl.firstChild) {
        forceGraphEl.removeChild(forceGraphEl.firstChild);
    }
    forceGraphEl.appendChild(ForceGraph(resultData || forceGraphData));

    refreshTable(resultData || forceGraphData)
}

refreshGraph();