function doneFetch(data) {
    Object.keys(data).forEach(key=>{
        if ( ! key.startsWith("_") ) {
            if ( data[key].level && data[key].level !== -1 ) {
                divisions[data[key].level-1].clubs[key] = data[key];
            } else if ( data[key].level && data[key].level === -1 ) {
                divisions[divisions.length-1].clubs[key] = data[key];
            }
        }
    });
    
    divisions.forEach(div=>{
        divHeader = document.createElement("H2");
        divHeader.innerHTML = div.name;
        dataContainer.append(divHeader);
        divClubs = document.createElement("UL");
        divClubs.id = "seasonlist";
        divClubs.classList.add("no-margin");
        
        Object.keys(div.clubs)
        .sort((a, b) => div.clubs[a].name.localeCompare(div.clubs[b].name))
        .forEach(cKey=>{
            clubLi = document.createElement("LI");
            clubLink = document.createElement("A");
            clubLink.innerHTML = div.clubs[cKey].name;
            clubLink.setAttribute("href","club.html?club="+cKey);
            clubLi.append(clubLink);
            divClubs.append(clubLi);
        });
        dataContainer.append(divClubs);
    });
}