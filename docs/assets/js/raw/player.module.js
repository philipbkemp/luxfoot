let params={};
window.location.search.replace("?","").split("&").forEach(param=>{const parts=param.split("=");params[parts[0]]=parts[1];});
const dataContainer = document.getElementById("dataContainer");
window.allTeams = [];
window.dataKeySet = [];
    
try {
    const [rTeams,rPlayer] = await Promise.all([
        fetch("data/teams.json"),
        fetch("data/players/"+getFolder(params.who)+"/"+params.who.toLowerCase()+".json")
    ]);
    window.allTeams = await rTeams.json();
    if ( rPlayer.ok ) {
        doneFetch(await rPlayer.json());
    } else {
        let errorP = document.createElement("P");
        errorP.classList.add("error");
        errorP.textContent = "Player not found";
        document.body.append(errorP);
    }
} catch (error) {
    handleError(error);
}

function doneFetch(data) {
    window.dataKeySet = [...window.dataKeySet,...Object.keys(data)];

    document.getElementsByTagName("H1")[0].innerHTML += data.name.join(" ");
    document.title += " | " + data.name.join(" ");
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'name');

    let born = document.createElement("P");
    let bornLabel = document.createElement("LABEL");
    bornLabel.classList.add("stat-label");
    bornLabel.innerHTML = "Born:";
    born.append(bornLabel);
    born.append(data.born);
    dataContainer.append(born);
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'born');

    if ( data.died ) {
        let died = document.createElement("P");
        let diedLabel = document.createElement("LABEL");
        diedLabel.classList.add("stat-label");
        diedLabel.innerHTML = "Died:";
        died.append(diedLabel);
        died.append(data.died);
        dataContainer.append(died);
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'died');
    }

    if ( data.position !== "??" ) {
        let position = document.createElement("P");
        let positionLabel = document.createElement("LABEL");
        positionLabel.classList.add("stat-label");
        positionLabel.innerHTML = "Position:";
        position.append(positionLabel);
        position.append(getPosition(data.position));
        dataContainer.append(position);
    }
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'position');

    window.dataKeySet = [...window.dataKeySet,...Object.keys(data.total).map(key => `total.${key}`)];
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'total');
    if ( data.total["M"] ) {
        window.dataKeySet = [...window.dataKeySet,...Object.keys(data.total["M"]).map(key => `total.M.${key}`)];
        let mens = document.createElement("P");
        let mensLabel = document.createElement("LABEL");
        mensLabel.classList.add("stat-label");
        mensLabel.innerHTML = "Men's Team:";
        mens.append(mensLabel);
        mens.append(drawCapGoals(data.total["M"],data.position));
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'total.M');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'total.M.caps');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'total.M.goals');
        dataContainer.append(mens);
    }

    const hr = document.createElement("HR");
    dataContainer.append(hr);

    let h2 = document.createElement("H2");
    h2.innerHTML = "Matches";
    dataContainer.append(h2);
    drawMatches(data.matches,"matches",null,{isSeason:false,compColumn:true,focusPlayer:params.who});
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches');

    if ( window.dataKeySet.length !== 0 ) {
        console.error(window.dataKeySet.join(", "));
        console.log(data);
    }
}

function drawCapGoals(total,pos) {
    let show = total.caps + " cap" + (total.caps === 1 ? "" : "s");
    if ( pos !== "GK" || total.goals !== 0 ) {
        show += " / ";
        show += total.goals + " goals";
    }
    return show;
}


function getFolder(name) {
    const c = name[0];
    let range;
    if (c <= 'G') range = 'A-G';
    else if (c <= 'N') range = 'H-N';
    else if (c <= 'U') range = 'O-U';
    else range = 'V-Z';

    return `${range}/${c}`;
}

function getPosition(pos) {
    switch (pos) {
        case "GK": pos = "Goalkeeper"; break;
        case "FW": pos = "Forward"; break;
    }
    
    return pos;
}