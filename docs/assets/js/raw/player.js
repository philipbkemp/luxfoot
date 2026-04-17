function doneFetch(data) {
    keys = [...keys,...Object.keys(data)];

    intPlayers[params.who] = {
        name: data.name
    };

    document.getElementsByTagName("H1")[0].innerHTML += data.name.join(" ");
    document.title += " | " + data.name.join(" ");
    keys = keys.filter(key => key !== 'name');

    born = document.createElement("P");
    bornLabel = document.createElement("LABEL");
    bornLabel.classList.add("stat-label");
    bornLabel.innerHTML = "Born:";
    born.append(bornLabel);
    born.append(data.born);
    dataContainer.append(born);
    keys = keys.filter(key => key !== 'born');

    if ( data.died ) {
        died = document.createElement("P");
        diedLabel = document.createElement("LABEL");
        diedLabel.classList.add("stat-label");
        diedLabel.innerHTML = "Died:";
        died.append(diedLabel);
        died.append(data.died);
        dataContainer.append(died);
        keys = keys.filter(key => key !== 'died');
    }

    if ( data.position !== "??" ) {
        position = document.createElement("P");
        positionLabel = document.createElement("LABEL");
        positionLabel.classList.add("stat-label");
        positionLabel.innerHTML = "Position:";
        position.append(positionLabel);
        position.append(getPosition(data.position));
        dataContainer.append(position);
    }
    keys = keys.filter(key => key !== 'position');

    keys = [...keys,...Object.keys(data.total).map(key => `total.${key}`)];
    keys = keys.filter(key => key !== 'total');
    if ( data.total["M"] ) {
        keys = [...keys,...Object.keys(data.total["M"]).map(key => `total.M.${key}`)];
        mens = document.createElement("P");
        mensLabel = document.createElement("LABEL");
        mensLabel.classList.add("stat-label");
        mensLabel.innerHTML = "Men's Team:";
        mens.append(mensLabel);
        mens.append(drawCapGoals(data.total["M"],data.position));
        keys = keys.filter(key => key !== 'total.M');
        keys = keys.filter(key => key !== 'total.M.caps');
        keys = keys.filter(key => key !== 'total.M.goals');
        dataContainer.append(mens);
    }

    hr = document.createElement("HR");
    dataContainer.append(hr);

    h2 = document.createElement("H2");
    h2.innerHTML = "Matches";
    dataContainer.append(h2);
    drawMatches(data.matches,"matches",null,false,false,true,params.who);
    keys = keys.filter(key => key !== 'matches');

    if ( keys.length !== 0 ) {
        console.error(keys.join(", "));
        console.log(data);
    }
}

function drawCapGoals(total,pos) {
    show = total.caps + " cap" + (total.caps !== 1 ? "s" : "");
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