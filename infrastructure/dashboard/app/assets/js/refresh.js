function mapContent(data, dataKey) {
    const ul = document.createElement('ul');
    for (const [key, content] of Object.entries(data)) {
        let li = document.createElement('li');
        li.innerText = content[dataKey]
        ul.appendChild(li);
    }
    return ul
}

function refreshTable() { 
    var tbodyEl = document.querySelector("tbody");
    while (tbodyEl.rows.length > 0) {
        tbodyEl.deleteRow(0);
    }
    var template = document.querySelector('#table-template');
    
    org_info["teams"].forEach( element => {
        // Clone the new row and insert it into the table
        var clone = template.content.cloneNode(true);
        var td = clone.querySelectorAll("td");
        td[0].textContent = element.name;
        td[1].textContent = element.description;
        td[2].appendChild(mapContent(org_info["membersPerTeam"][element.name]["members_url"], "login"));
        td[3].appendChild(mapContent(org_info["membersPerTeam"][element.name]["repositories_url"], "name"));

        tbodyEl.appendChild(clone);
    });

    inputFilter = document.getElementById("search_team");
    inputFilter.oninput = searchTable;
}

function searchTable() {
    // Declare variables
    var filter, table, tr, i, innerText;
    filter = inputFilter.value.toUpperCase();
    table = document.getElementById("teams_table");
    tr = table.getElementsByTagName("tr");
 
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {
        innerText = tr[i].innerText;
        if (innerText) {
            if (innerText.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

refreshTable();