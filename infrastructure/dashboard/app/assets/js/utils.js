/** CHART */

const sorting = (ascending, key) => {
    return (ascending) ? (a, b) => a[key] - b[key] : (a, b) => b[key] - a[key];
}

const chartOptions = (title) => {
    return {
        plugins: {
            title: {
                display: true,
                text: title,
                font: { size: 24 }
            },
            legend: { labels: { font: { size: 12 } } }
        },
        scales: { y: { beginAtZero: true } }
    };
};

const chartOptionsData = (data, label1, label2) => {
    return {
        labels: data.labels,
        datasets: [
            {
                label: label1,
                data: data.data1,
                backgroundColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
                stack: 'Stack 0'
            },
            {
                label: label2,
                data: data.data2,
                backgroundColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                stack: 'Stack 0'
            }
        ]
    };
};

const stackedBarChart = (data, title, label1, label2, id) => {
    const ctx = document.getElementById(id);
    new Chart(ctx, {
        type: 'bar',
        data: chartOptionsData(data, label1, label2),
        options: chartOptions(title)
    });
}

const setChartData = async (data) => {
    const labels = [];
    const data1 = [];
    const data2 = [];

    data.forEach(d => {
        labels.push(d.label);
        data1.push(d.data1);
        data2.push(d.data2);
    });

    return { labels, data1, data2 };
}

/** TABLE */

const createTableContentDetails = (text, content) => {
    const details = document.createElement('details');

    const summary = document.createElement('summary');
    summary.innerHTML = `<span class="govuk-details__summary-text"> ${text} </span>`;

    const div = document.createElement('div');

    div.setAttribute("class", "govuk-details__text");
    div.appendChild(content);

    details.appendChild(summary);
    details.appendChild(div);

    return details;
}

const mapTableContent = (iterator, content) => {
    const ul = document.createElement('ul');
    for (const name of iterator) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${content[name]["html_url"]}">${name}</a>`;
        ul.appendChild(li);
    }
    return ul
}

const searchTable = () => {
    // Declare variables
    let filter, table, tr, i, innerText;
    filter = inputFilter.value;
    table = document.getElementById("sortable_table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {
        innerText = tr[i].innerText;
        if (innerText) {
            if (innerText.indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}