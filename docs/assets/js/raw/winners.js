function doneFetch(data) {
    firstSeason = data[showComp].first;
    notAwarded = data[showComp].not_awarded;
    
    firstSeasonIndex = allSeasons.findIndex(el => el === firstSeason);
    allSeasons = firstSeasonIndex !== -1 ? allSeasons.slice(firstSeasonIndex) : allSeasons;
    
    if ( data.league ) {
        navLeague = document.createElement("A");
        navLeague.href = "winners.html?comp=league";
        navLeague.innerHTML = "League";
        if ( "league" === showComp ) {
            navLeague.classList.add("active");
            drawWinnersList(data.league.winners);
        }
        navLeagueLi = document.createElement("LI");
        navLeagueLi.append(navLeague);
        compNav.append(navLeagueLi);
    }
    
    notAwarded.forEach(s=>{
        allSeasons = allSeasons.filter(key => key !== s);
    });

    if ( allSeasons.length !== 0 ) {
        allSeasons.forEach(s=>{
            console.error("No winner defined for season",s);
        });
    }
}

function drawWinnersList(data) {
    dataContainer = document.getElementById("dataContainer");
    
    table = document.createElement("TABLE");
    table.classList.add("winners");
    thead = document.createElement("THEAD");
    trHead = document.createElement("TR");
    thPlace = document.createElement("TH");
    thPlace.innerHTML = "#";
    trHead.append(thPlace);
    thTeam = document.createElement("TH");
    thTeam.innerHTML = "Team";
    trHead.append(thTeam);
    thChampions = document.createElement("TH");
    thChampions.innerHTML = "Champions";
    trHead.append(thChampions);
    thYears = document.createElement("TH");
    thYears.innerHTML = "";
    trHead.append(thYears);
    thead.append(trHead);
    table.append(thead);
    
    tbody = document.createElement("TBODY");
    pos = 1;
    prevCount = -1;
    data.forEach(entry=>{
        if ( entry.team ) {
            row = document.createElement("TR");
            thisCount = entry.seasons.length;
            
            place = document.createElement("TD");
            place.innerHTML = prevCount === thisCount ? "=" : pos;
            row.append(place);
            
            teamName = document.createElement("TD");
            teamName.innerHTML = allTeams[entry.team].name;
            row.append(teamName);
            
            count = document.createElement("TD");
            count.innerHTML = thisCount;
            row.append(count);
            
            seasons = document.createElement("TD");
            seasons.innerHTML = entry.seasons.join(", ");
            row.append(seasons);
            
            prevCount = thisCount;
            
            tbody.append(row);
            pos++;
        }
        
        entry.seasons.forEach(s=>{
            allSeasons = allSeasons.filter(key => key !== s);
        });
    });
    table.append(tbody);
    
    dataContainer.append(table);
}