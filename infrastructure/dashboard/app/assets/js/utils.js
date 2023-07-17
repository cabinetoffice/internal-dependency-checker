var org_info;

const loadFile = async (file) =>{
    try {
        const response = await fetch(file);
        return await response.json();
      } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
        return {};
      }
}

const setPieData = async () => {
    const data = await loadFile("../assets/data/teams.json");
    return Object.entries(data).map( e => {
        const numMembers = Object.keys(e[1]["members"]).length;
        return {
                label: `${e[0]} #${numMembers}`,
                value: numMembers
            }
    }).sort( (a, b) => a.value - b.value );
}

const setTableData = async () => {
    return await loadFile("../assets/data/teams.json");
}