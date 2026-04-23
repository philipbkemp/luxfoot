let params={};
window.location.search.replace("?","").split("&").forEach(param=>{const parts=param.split("=");params[parts[0]]=parts[1];});
const showComp = params.comp ?? "league";

let allTeams = null;

const compNav = document.getElementById("competitions");
let allSeasons = [];

try {
    const [rTeams,rSeasons,rWinners] = await Promise.all([
        fetch("data/teams.json"),
        fetch("data/seasons.json"),
        fetch("data/winners.json")
    ]);
    allTeams = await rTeams.json();
    allSeasons = await rSeasons.json();
    doneFetch(await rWinners.json());
} catch (error) {
    handleError(error);
}

function doneFetch(data) {
    const firstSeason = data[showComp].first;
    const notAwarded = data[showComp].not_awarded;

    let firstSeasonIndex = allSeasons.indexOf(firstSeason);
    allSeasons = firstSeasonIndex === -1 ? allSeasons : allSeasons.slice(firstSeasonIndex);

    if ( data.league ) {
        let navLeague = document.createElement("A");
        navLeague.href = "winners.html?comp=league";
        navLeague.innerHTML = "League";
        if ( "league" === showComp ) {
            navLeague.classList.add("active");
            drawWinnersList(data.league.winners);
        }
        let navLeagueLi = document.createElement("LI");
        navLeagueLi.append(navLeague);
        compNav.append(navLeagueLi);
    }

    if ( data.cup_luxembourg ) {
        let navLeague = document.createElement("A");
        navLeague.href = "winners.html?comp=cup_luxembourg";
        navLeague.innerHTML = "Luxembourg Cup";
        if ( "cup_luxembourg" === showComp ) {
            navLeague.classList.add("active");
            drawWinnersList(data.cup_luxembourg.winners);
        }
        let navLeagueLi = document.createElement("LI");
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
    const dataContainer = document.getElementById("dataContainer");

    let table = document.createElement("TABLE");
    table.classList.add("winners");
    let thead = document.createElement("THEAD");
    let trHead = document.createElement("TR");
    let thPlace = document.createElement("TH");
    thPlace.innerHTML = "#";
    trHead.append(thPlace);
    let thTeam = document.createElement("TH");
    thTeam.innerHTML = "Team";
    trHead.append(thTeam);
    let thChampions = document.createElement("TH");
    thChampions.innerHTML = "Champions";
    trHead.append(thChampions);
    let thYears = document.createElement("TH");
    thYears.innerHTML = "";
    trHead.append(thYears);
    thead.append(trHead);
    table.append(thead);

    let tbody = document.createElement("TBODY");
    let pos = 1;
    let prevCount = -1;
    data.sort((a,b)=>{
        const lengthDiff = b.seasons.length - a.seasons.length;
        if (lengthDiff !== 0) return lengthDiff;
        return a.seasons[0].localeCompare(b.seasons[0]);
    }).forEach(entry=>{
        if ( entry.team ) {
            let row = document.createElement("TR");
            const thisCount = entry.seasons.length;

            let place = document.createElement("TD");
            place.innerHTML = prevCount === thisCount ? "=" : pos;
            row.append(place);

            let teamName = document.createElement("TD");
            teamName.innerHTML = allTeams[entry.team].name;
            row.append(teamName);

            let count = document.createElement("TD");
            count.innerHTML = thisCount;
            row.append(count);

            let seasons = document.createElement("TD");
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