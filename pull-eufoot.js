console.clear();
luxGoals = [];
thisGame = {
    season: prompt("Which season?")
};
months = {"January":"01","February":"02","March":"03","April":"04","May":"05","June":"06","July":"07","August":"08","September":"09","October":"10","November":"11","December":"12"};
short = {"France":"FRA","Luxembourg":"LUX","Belgium":"BEL"};
competitions = {"International Friendly":"Friendly"};
out = '{\n';
dateValue = document.querySelectorAll(".dtd.d7.c7")[0].textContent.trim().split(", ")[1].split(" ");
dateParts = [dateValue[2],months[dateValue[1]],dateValue[0]];
out += '\t"date": "'+dateParts.join("-")+'",\n';
thisGame.date = dateParts.join("-");
timeValue = document.querySelectorAll(".dtd.d7.c7")[0].textContent.trim().split(", ")[2].split(" ")[0];
out += '\t"kickoff": "'+timeValue+'",\n';
teams = document.querySelectorAll(".dtd.w18");
homeTeam = short[teams[0].textContent.trim()];
if ( ! homeTeam ) {
    console.error("Unknown",teams[0].textContent.trim());
}
awayTeam = short[teams[1].textContent.trim()];
if ( ! awayTeam ) {
    console.error("Unknown",teams[1].textContent.trim());
}
out += '\t"home": "'+homeTeam+'",\n';
out += '\t"away": "'+awayTeam+'",\n';
if ( homeTeam === "LUX" ) {
    thisGame.opponent = awayTeam;
} else if ( awayTeam === "LUX" ) {
    thisGame.opponent = homeTeam;
} else {
    console.error("Luxembourg not playing?",homeTeam,awayTeam);
}
comp = document.querySelectorAll(".dtd.d7.c7")[1].textContent.trim();
if ( competitions[comp] ) {
    comp = competitions[comp];
} else {
    console.warn("Competition",comp);
}
thisGame.score = document.querySelector(".b12.p49.d4.nw").textContent.trim();
out += '\t"score": "'+thisGame.score+'",\n';
out += '\t"competition": "'+comp+'",\n';
attVenue = dateValue = document.querySelectorAll(".dtd.d7.c7")[2].textContent.split(", ");
out += '\t"venue": {\n';
out += '\t\t"country": "'+prompt("Country code of this town?",attVenue[2].trim())+'",\n';
out += '\t\t"town": "'+attVenue[2].trim()+'",\n';
out += '\t\t"stadium": "'+attVenue[1].trim()+'"\n';
out += '\t},\n',
out += '\t"attendance": '+attVenue[0].replace(" ","")+',\n';
refValue = document.querySelectorAll(".dtd.d3.c7")[1].textContent.trim().split(", ");
refCountry = short[refValue[1].split(" / ")[1].trim()];
if ( ! refCountry ) {
    console.error("Unknown",refValue[1].split(" / ")[1].trim());
}
out += '\t"referee": {\n';
out += '\t\t"name": "'+refValue[0]+'",\n';
out += '\t\t"country": "'+refCountry+'"\n';
out += '\t},\n';
goals = document.querySelectorAll(".dtd.d3.c7")[2].textContent.trim().split(", ");
out += '\t"goals": [\n';
for ( goalIndex=0 ; goalIndex!==goals.length; goalIndex++ ) {
    goal = goals[goalIndex];
    g = goal.replace("'","").split("(")[1].split(") ");
    thisGoal = {
        minute: parseInt(g[0]),
        scorer: g[1].trim()
    };
    if ( goal.indexOf("(pen.)") !== -1 ) {
        thisGoal.penalty = true;
    }
    out += '\t\t{ ';
    homeList = document.querySelectorAll(".kn.m11")[0].textContent.indexOf(thisGoal.scorer);
    awayList = document.querySelectorAll(".kn.m11")[1].textContent.indexOf(thisGoal.scorer);
    if ( homeList !== -1 ) {
        out += '"team": "'+homeTeam+'", ';
        if ( homeTeam === "LUX" ) {
            luxGoals.push(thisGoal);
        }
    } else if ( awayList !== -1 ) {
        out += '"team": "'+awayTeam+'", ';
        if ( awayTeam === "LUX" ) {
            luxGoals.push(thisGoal);
        }
    } else {
        console.error("Which team?",thisGoal.scorer);
    }
    out += '"minute": '+thisGoal.minute+', ';
    out += '"scorer": "'+thisGoal.scorer+'"';
    if ( thisGoal.penalty ) {
        out += ', "penalty": true';
    }
    out += ' }'+(goalIndex!==(goals.length-1)?',':'')+'\n';
};
out += '\t],\n';
if ( homeTeam === "LUX" ) {
    squad = document.querySelectorAll(".kn.m11")[0];
} else if ( awayTeam === "LUX" ) {
    squad = document.querySelectorAll(".kn.m11")[1];
}
players = squad.querySelectorAll(".d7.kr.c6, .d3.kr.c6");
out += '\t"players": [\n';
for ( p=0 ; p!==players.length ; p++ ) {
    player = players[p];
    playerLink = player.querySelector("a");
    pid = parseInt(playerLink.getAttribute("href").replace("_player.php?id=",""));
    pname = playerLink.textContent;
    captain = player.querySelector("img.c");
    divs = player.querySelectorAll("div");
    capNumber = parseInt(divs[1].textContent);
    club = divs[3].textContent.split(",")[0].trim();
    if ( getTeam(club) ) {
        club = getTeam(club);
    } else {
        console.error("Unknown club",club);
    }
    out += '\t\t{';
    out += ' "pid": '+(pid+"").padStart(5," ")+',';
    out += ' "name": "'+pname+'",';
    if ( captain ) {
        out += ' "is_captain": true,';
    }
    myGoals = luxGoals.filter(g=>{return g.scorer === pname;});
    if ( myGoals.length !== 0 ) {
        out += ' "goals": ' + JSON.stringify(myGoals) + ',';
    }
    out += ' "capNumber": '+capNumber+',';
    out += ' "club": "'+club+'",';
    out += ' "game": '+ JSON.stringify(thisGame);
    out += '}'+(p!==players.length-1?',':'')+'\n';
}
out += '\t]\n';
out += '}';
console.log('\x1B[40;93;4m     MATCH              \x1B[m');
console.log(out);

function getTeam(team) {
    team =  team.replace(" (A)","");

    teams = {"US Hollerich-Bonneweg":"HLBN","CS Fola":"FOLA","Racing Club Luxembourg":"RACL","Sporting Club Luxembourg":"SCLX","Chiers Rodange":"CROD","Etoile Sportive Clemency":"CLMC","Swift Hesperingen":"SWFT","Etzella Ettelbrück":"ETZE","Alliance Dudelange":"ADUD","Avenir Beggen":"AVBG","The Belval Belvaux":"BLVL","CS Echternach":"CECH","CS Hollerich":"CSHL","CS Petange":"CPET","Etoile Bleu Dudelange":"EBDU","Etoile Rouge 1908 Dudelange":"ERDU","Fola Esch":"FOLA","US Hollerich/Bonnevoie":"HLBN","Jeunesse Bettembourg":"JBET","Jeunesse Esch":"JESH","Jeunesse 07 Kayl":"JKYL","Jeunesse Steinfort":"JSTF","Jeunesse Weimerskirch":"JWMK","CS Mondorf-les-Bains":"MDLB","National Schifflange":"NSCH","Phalanx Kleinbettingen":"PHLK","Racing Club Luxemburg":"RACL","CS Rollingergrund":"ROLG","Sporting Club Luxemburg":"SCLX","SC Differdange":"SDIF","Stade Dudelange":"SDUD","SC Tétange":"STET","US Esch":"UESH","US Rumelange":"URUM","US Dudelange":"USDD","Résidence Walferdange":"WALF","Young Boys Diekirch":"YBDK","US Hollerich/Bonneweg":"HLBN","CS Petingen":"CPET","Stade Düdelingen":"SDUD","SC Differdingen":"SDIF","Jeunesse de la frontière Steinfort":"JSTF","The National Schifflingen":"NSCH","Etoile Rouge 1908 Düdelingen":"ERDU","US Rümelingen":"URUM","Eclair Bettembourg":"ECBT","Alliance Düdelingen":"ADUD"};
    if ( teams[team] ) {
        return teams[team];
    }
    console.error("Unknown team",team);
    return team;
}