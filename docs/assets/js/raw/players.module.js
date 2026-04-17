let params={};
window.location.search.replace("?","").split("&").forEach(param=>{const parts=param.split("=");params[parts[0]]=parts[1];});
const mode = params.comp ?? "M";

const dataContainer = document.getElementById("dataContainer");

let players = [];

const compNav = document.getElementById("competitions");
    
try {
    const rIntPlayers = await fetch("data/intplayers.json");
    doneFetch(await rIntPlayers.json());
} catch (error) {
    handleError(error);
}

function doneFetch(data) {              
    if ( Object.keys(data).length > 25 ) {
        alert("Pagination needed");
    }
    
    let navLeague = document.createElement("A");
    navLeague.href = "players.html?comp=men";
    navLeague.innerHTML = "Men's";
    if ( "M" === mode ) {
        navLeague.classList.add("active");
    }
    let navLeagueLi = document.createElement("LI");
    navLeagueLi.append(navLeague);
    compNav.append(navLeagueLi);
    
    Object.keys(data).forEach(key=>{
        if ( data[key]?.total?.[mode] && data[key].teams.includes(mode) ) {
            data[key].code = key;
            players.push(data[key]);
        }
    });
    players.sort((a, b) => {
        const capDiff = b.total[mode].caps - a.total[mode].caps;
        if (capDiff !== 0) return capDiff;
        
        const goalDiff = b.total[mode].goals - a.total[mode].goals;
        if (goalDiff !== 0) return goalDiff;
        
        const aDate = new Date(a.total[mode].debut);
        const bDate = new Date(b.total[mode].debut);
        return aDate.getTime() - bDate.getTime();
    });
    
    let table = document.createElement("TABLE");
    table.classList.add("int-caps");
    let thead = document.createElement("THEAD");
    let trHead = document.createElement("TR");
    let thCaps = document.createElement("TH");
    thCaps.innerHTML = "Caps";
    trHead.append(thCaps);
    let thGoals = document.createElement("TH");
    thGoals.innerHTML = "Goals";
    trHead.append(thGoals);
    let thPlayer = document.createElement("TH");
    thPlayer.innerHTML = "Player";
    trHead.append(thPlayer);
    let thDebut = document.createElement("TH");
    thDebut.innerHTML = "Debut";
    trHead.append(thDebut);
    thead.append(trHead);
    table.append(thead);
    
    let tbody = document.createElement("TBODY");
    players.forEach(p=>{
        let row = document.createElement("TR");
        
        let tdCaps = document.createElement("TD");
        tdCaps.innerHTML = p.total[mode].caps;
        row.append(tdCaps);
        
        let tdGoals = document.createElement("TD");
        tdGoals.innerHTML = p.position === "GK" ? "" : p.total[mode].goals;
        row.append(tdGoals);
        
        let tdPlayer = document.createElement("TD");
        let tdPlayerLink = document.createElement("A");
        tdPlayerLink.innerHTML = p.name.join(" ");
        tdPlayerLink.setAttribute("href","player.html?who="+p.code);
        tdPlayer.append(tdPlayerLink);
        row.append(tdPlayer);
        
        let tdDebut = document.createElement("TD");
        tdDebut.innerHTML = p.total[mode].debut;
        row.append(tdDebut);
        
        tbody.append(row);
    });
    table.append(tbody);
    
    dataContainer.append(table);
}