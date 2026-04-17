let divisions = [{
    "name": "National Division",
    "clubs": {}
},{
    "name": "Division of Honour",
    "clubs": {}
},{
    "name": "1. Division",
    "clubs": {}
},{
    "name": "2. Division",
    "clubs": {}
},{
    "name": "3. Division",
    "clubs": {}
},{
    "name": "Defunct",
    "clubs": {}
}];

const dataContainer = document.getElementById("dataContainer");

window.dataKeySet = [];
    
try {
    const rTeams = await fetch("data/teams.json");
    doneFetch(await rTeams.json())                
} catch (error) {
    handleError(error);
}

function doneFetch(data) {
    Object.keys(data).forEach(key=>{
        if ( ! key.startsWith("_") ) {
            if ( data[key].level && data[key].level !== -1 ) {
                divisions[data[key].level-1].clubs[key] = data[key];
            } else if ( data[key].level && data[key].level === -1 ) {
                divisions.at(-1).clubs[key] = data[key];
            }
        }
    });
    
    divisions.forEach(div=>{
        let divHeader = document.createElement("H2");
        divHeader.innerHTML = div.name;
        dataContainer.append(divHeader);
        let divClubs = document.createElement("UL");
        divClubs.id = "seasonlist";
        divClubs.classList.add("no-margin");
        
        Object.keys(div.clubs)
        .sort((a, b) => div.clubs[a].name.localeCompare(div.clubs[b].name))
        .forEach(cKey=>{
            let clubLi = document.createElement("LI");
            let clubLink = document.createElement("A");
            clubLink.innerHTML = div.clubs[cKey].name;
            clubLink.setAttribute("href","club.html?club="+cKey);
            clubLi.append(clubLink);
            divClubs.append(clubLi);
        });
        dataContainer.append(divClubs);
    });
}