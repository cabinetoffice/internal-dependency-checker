const pieChart = (data, id) => {
    console.log(data);
    // Select the chart container
    const chartContainer = d3.select(`#${id}`);

    // Set the dimensions for the chart
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Create the SVG element within the container
    const svg = chartContainer
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Define the pie layout
    const pie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

    // Define an arc generator
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Generate the pie slices
    const slices = svg
        .selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => d3.schemeCategory10[i])
        .attr("class", "slice") // Add a class for styling

        // Add tooltip functionality
        .on("mouseover", function (event, d) {
            const tooltip = d3.select("#tooltip");

            tooltip
                .style("display", "block")
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px")
                .html(`<strong>${d.data.category}</strong><br>${d.data.value}`);
        })
        .on("mouseout", function () {
            d3.select("#tooltip").style("display", "none");
        });

    // Add labels to the slices
    svg.selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text((d) => d.data.label);

    // Add a legend
    const legend = chartContainer
        .append("div")
        .attr("class", "legend")
        .selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "legend-item");

    legend
        .append("span")
        .attr("class", "legend-color")
        .style("background-color", (d, i) => d3.schemeCategory10[i]);

    legend
        .append("span")
        .attr("class", "legend-label")
        .text((d) => d.label);
}

const barChart = (data, id) => {
    // Select the chart container
    const chartContainer = d3.select(`#${id}`);

    // Set the dimensions for the chart
    const width = 400;
    const height = 300;

    // Create the SVG element within the container
    const svg = chartContainer
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Set the scales for the x and y axes
    const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.category))
        .range([0, width])
        .padding(0.1);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .range([height, 0]);

    // Create the bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.category))
        .attr("y", (d) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d.value))
        .attr("fill", "steelblue");

    // Create the x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    // Create the y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append("g").call(yAxis);
}

(async () => {
    const pieData = await setPieData();
    pieChart(pieData.slice(0, 10), "teams_pie_chart");
    barChart(pieData.slice(0, 10), "teams_bar_chart");
})()
