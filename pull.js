console.clear();
haveStandings = false;
season = window.location.href.split("/").pop().split(".")[0].replace("Saison","");
seasonShort = season.replace("-20","-").replace("-19","-");
allStandings = {};
allMatches = {};
allPlayoffs = {}; allLevelPlayoffs = {};
allPlayoffTeams = []; allLevelPlayoffTeams = [];

document.querySelectorAll("table").forEach(table=>{
    innerTables = table.querySelectorAll("table");
    if ( innerTables.length === 1 ) {
        theTable = innerTables[0];
        r = theTable.querySelectorAll("tr");
        if ( r.length > 0 ) {
            c = r[0].querySelectorAll("td");
            if ( c.length > 1 ) {
                rOne_cTwo = c[1];
                if ( rOne_cTwo.textContent.trim() === "Verein" ) {
                    pullStandings(theTable);
                } else if ( rOne_cTwo.textContent.trim().length === 3 ) {
                    pullResults(theTable);
                } else {
                    console.log("unknown rc",rOne_cTwo.textContent);
                }
            } else if ( c.length === 1 ) {
                pullCup(theTable);
            } else {
                console.log("unknown c",c);
            }
        } else {
            console.log("unknown r",r);
        }
    }
});

function getTeam(team) {

   team =  team.replace(" (A)","");

    teams = {"Alliance Dudelange":"ADUD","Avenir Beggen":"AVBG","The Belval Belvaux":"BLVL","CS Echternach":"CECH","CS Hollerich":"CSHL","CS Petange":"CPET","Etoile Bleu Dudelange":"EBDU","Etoile Rouge 1908 Dudelange":"ERDU","Fola Esch":"FOLA","US Hollerich/Bonnevoie":"HLBN","Jeunesse Bettembourg":"JBET","Jeunesse Esch":"JESH","Jeunesse 07 Kayl":"JKYL","Jeunesse Steinfort":"JSTF","Jeunesse Weimerskirch":"JWMK","CS Mondorf-les-Bains":"MDLB","National Schifflange":"NSCH","Phalanx Kleinbettingen":"PHLK","Racing Club Luxemburg":"RACL","CS Rollingergrund":"ROLG","Sporting Club Luxemburg":"SCLX","SC Differdange":"SDIF","Stade Dudelange":"SDUD","SC Tétange":"STET","US Esch":"UESH","US Rumelange":"URUM","US Dudelange":"USDD","Résidence Walferdange":"WALF","Young Boys Diekirch":"YBDK","US Hollerich/Bonneweg":"HLBN","CS Petingen":"CPET","Stade Düdelingen":"SDUD","SC Differdingen":"SDIF","Jeunesse de la frontière Steinfort":"JSTF","The National Schifflingen":"NSCH","Etoile Rouge 1908 Düdelingen":"ERDU","US Rümelingen":"URUM","Eclair Bettembourg":"ECBT","Alliance Düdelingen":"ADUD"};
    if ( teams[team] ) {
        return teams[team];
    }
    console.error("Unknown team",team);
    return team;
}

function getTeamOrEmpty(team) {
    teamCode = getTeam(team);
    if ( teamCode === team ) {
        return "";
    }
    return teamCode;
}

function findLeague(league) {
    theLeague = {
        level: "UNKNOWN",
        name: league
    }

    switch ( league ) {
        case "1. Division":
            theLeague.level = 1;
            break;
        case "2. Division":
            theLeague.level = 2;
            break;
        case "3. Division - 1. Bezirk":
        case "3. Division - 2. Bezirk":
            theLeague.level = 3;
            theLeague.series = theLeague.name.split(" - ")[1].split(".")[0].trim();
            theLeague.name = theLeague.name.replace(" - "," Series ").replace(". Bezirk","");
            break;
        case "3. Division - Bezirk Luxemburg":
        case "3. Division - Bezirk Esch":
            theLeague.level = 3;
            theLeague.series = theLeague.name.split(" - ")[1].split(" ")[1].trim();
            if ( theLeague.series === "Luxemburg" ) { theLeague.series = 1;
            } else if ( theLeague.series === "Esch" ) { theLeague.series = 2;
            }
            theLeague.name = theLeague.name.replace(" - "," Series ").replace("Bezirk ","");
            break;
        default:
            console.error("Unknown league",league);
    }

    return theLeague;
}

function pullStandings(table) {
    psTable = table;

    pts_win = 3;

    while ( psTable.parentElement.tagName !== "TABLE" ) {
        psTable = psTable.parentElement;
    }
    parentTable = psTable.parentElement;
    league = parentTable.querySelector("td p").textContent
        .replace("Die Tabelle der","")
        .replace(season.replace("-","/"),"")
        .trim()
        ;
    leagueData = findLeague(league);

    standings = [];
    rows = table.querySelectorAll("tr");
    for ( r=1 ; r!==rows.length ; r++ ) {
        cols = rows[r].querySelectorAll("td");
        if ( cols.length === 15 ) {
            clubName = cols[1].textContent.trim()
                .replace(" (M)","")
                .replace(" (N)","")
                .replace(" *","")
                ;
            thisStanding = {
                place: r,
                team: getTeam(clubName),
                w: parseInt(cols[4].textContent),
                d: parseInt(cols[5].textContent),
                l: parseInt(cols[6].textContent),
                f: parseInt(cols[10].textContent),
                a: parseInt(cols[12].textContent),
                season: seasonShort,
                level: leagueData.level,
                league: leagueData.name
            };
            if ( leagueData.series ) {
                thisStanding.series = leagueData.series;
            }
            if ( pts_win !== 3 ) {
                thisStanding.pts_win = pts_win;
            } else if ( (thisStanding.w*3)+thisStanding.d !== parseInt(cols[8].textContent) ) {
                 if ( (thisStanding.w*2)+thisStanding.d === parseInt(cols[8].textContent) ) {
                    thisStanding.pts_win = 2;
                    pts_win = 2;
                } else {
                    console.warn("Unknown pts_win",leagueData,parseInt(cols[8].textContent) );
                }
            }
            [4,5,6,8,10,12].forEach(i=>{cols[i].style.backgroundColor = "yellow";});
            bgColor = cols[1].getAttribute("bgcolor");
            if ( bgColor === "#00FFFF" ) {
                thisStanding.champion = true;
                thisStanding.title_count = prompt("Title count needed for "+clubName);
            } else if ( bgColor === "#FF0000" ) {
                thisStanding.relegated = true;
            } else if ( bgColor === "#00FF00" ) {
                thisStanding.promoted = true;
            }
            standings.push(thisStanding);
        } else {
            if ( cols.length === 1 && cols[0].textContent.trim() === "" ) {
                // nothing stated
            } else {
                console.warn("Unknown standings data");
            }
        }
    }
    allKey = leagueData.level;
    if ( leagueData.series ) {
        allKey += "_" + leagueData.series;
    }
    allStandings[allKey] = standings;
}

function pullResults(table) {
    resTable = table;
    rows = resTable.querySelectorAll("tr");
    while ( resTable.parentElement.tagName !== "TABLE" ) {
        resTable = resTable.parentElement;
    }
    parentTable = resTable.parentElement;
    league = parentTable.querySelector("td p").textContent
        .replace("Ergebniskasten der","")
        .replace(season.replace("-","/"),"")
        .trim()
        ;
    leagueData = findLeague(league);
    resTeams = [];
    matches = [];
    rows.forEach(row=>{
        cols = row.querySelectorAll("td");
        col1 = cols[0];
        if ( cols.length !== 1 && col1.textContent.trim() !== "" ) {
            resTeams.push( getTeam(col1.textContent.trim()) );
        }
    });
    for ( r=0 ; r!==rows.length ; r++ ) {
        cols = rows[r].querySelectorAll("td");
        if ( cols[0].textContent.trim() === "" && cols.length !== 1) {
            // header 
        } else if ( cols[0].textContent.trim() === "" ) {
            // empty
        } else if ( cols.length === 1 ) {
            // note?
        } else {
            for ( c=1 ; c!==cols.length ; c++ ) {
                score = cols[c].textContent.trim();
                cols[c].style.backgroundColor = "yellow";
                if ( score.length > 1 ) {
                    score = score.split("-");
                    if ( score.length === 2 ) {
                        //console.log(resTeams[r-1],resTeams[c-1],score);
                        matches.push({
                            home: resTeams[r-1],
                            away: resTeams[c-1],
                            score: score[0].trim() + "-" + score[1].trim(),
                            season: seasonShort,
                            competition: {
                                type: "league",
                                level: leagueData.level,
                                name: leagueData.name
                            }
                        });
                    }
                }
            }
        }
    };
    allKey = leagueData.level;
    if ( leagueData.series ) {
        allKey += "_" + leagueData.series;
    }
    allMatches[allKey] = matches;
}

function pullCup(table) { console.log("CUP"); }

function addPlayoff() {
    levelPart = parseInt(prompt("Level"));
    level = levelPart;
    series = prompt("Series").trim();
    if ( series !== "" ) {
        series = parseInt(series);
        level += "_" + series;
    }
    home = "";
    while ( home === "" ) {
        home = getTeamOrEmpty( prompt("Home team") );
    }
    away = "";
    while ( away === "" ) {
        away = getTeamOrEmpty( prompt("Away team") );
    }
    score = prompt("Score");

    if ( ! allPlayoffs[level] ) {
        allPlayoffs[level] = [];
    }

    allPlayoffTeams.push(home);
    allPlayoffTeams.push(away);

    allPlayoffs[level].push({
        home: home,
        away: away,
        score: score,
        season: seasonShort,
        competition: {
            type: "league",
            round: "Winner playoff",
            level: allStandings[level][0].level,
            series: series,
            name: allStandings[level][0].league
        }
    });
}

function addLevelPlayoff() {
    levelPart = parseInt(prompt("Level"));
    level = levelPart;
    home = "";
    while ( home === "" ) {
        home = getTeamOrEmpty( prompt("Home team") );
    }
    homeSeries = parseInt(prompt("Home team Series"));
    away = "";
    while ( away === "" ) {
        away = getTeamOrEmpty( prompt("Away team") );
    }
    awaySeries = parseInt(prompt("Away team Series"));
    score = prompt("Score");

    allLevelPlayoffTeams.push(home);
    allLevelPlayoffTeams.push(away);

    playoffItem = {
        home: home,
        homeDivision: {
            level: level,
            series: homeSeries,
            name: allStandings[level+"_"+homeSeries][0].league
        },
        away: away,
        awayDivision: {
            level: level,
            series: awaySeries,
            name: allStandings[level+"_"+awaySeries][0].league
        },
        score: score,
        season: seasonShort,
        competition: {
            type: "league",
            round: "Promotion playoff",
            level: level,
            name: prompt("Name for level " + level)
        },
        promotion: {
            season:  prompt("Promotion to season:",(parseInt(seasonShort.split("-")[0])+1) + "-" + (parseInt(seasonShort.split("-")[1])+1)),
            level: parseInt(prompt("Promotion to level:",level-1)),
            name: prompt("Promotion to league",allStandings[level-1][0].league)
        }
    };

    if ( ! allLevelPlayoffs[level+"_"+homeSeries] ) {
        allLevelPlayoffs[level+"_"+homeSeries] = [];
    }
    if ( ! allLevelPlayoffs[level+"_"+awaySeries] ) {
        allLevelPlayoffs[level+"_"+awaySeries] = [];
    }
    allLevelPlayoffs[level+"_"+homeSeries].push(playoffItem);
    allLevelPlayoffs[level+"_"+awaySeries].push(playoffItem);
}

function addForfeitMatch() {
    levelPart = parseInt(prompt("Level"));
    level = levelPart;
    series = prompt("Series").trim();
    if ( series !== "" ) {
        series = parseInt(series);
        level += "_" + series;
    }
    home = "";
    while ( home === "" ) {
        home = getTeamOrEmpty( prompt("Home team") );
    }
    away = "";
    while ( away === "" ) {
        away = getTeamOrEmpty( prompt("Away team") );
    }
    index = allMatches[level].findIndex(m=>{return m.home === home && m.away === away;});
    allMatches[level][index].forfeit = true;
}

function buildLeague(level) {

    levelTeams = [];
    allStandings[level].forEach(s=>{
        levelTeams.push(s.team);
    });
    levelTeams.sort();

    teamsRelegated = [];
    teamsPromoted = [];
    teamChampion = "";

    levelPart = level.split("_")[0];
    series = "";
    if ( level.split("_").length !== 1 ) {
        series = level.split("_")[1];
    }

    out = '{\n';
    out += '\t"level": '+parseInt(levelPart)+',\n';
    if ( series !== "" ) {
        out += '\t"series": '+parseInt(series)+',\n';
    }
    out += '\t"season": "'+seasonShort+'",\n';
    out += '\t"name": "'+allStandings[level][0].league+'",\n';
    out += '\t"teams": ["'+levelTeams.join('","')+'"],\n';
    if ( allStandings[level][0].pts_win ) {
        out += '\t"pts_win": '+allStandings[level][0].pts_win+',\n';
    }
    out += '\t"standings": [\n';
    allStandings[level].forEach(s=>{
        out += '\t\t{';
        out += '"place": '+(s.place+"").padStart(2," ");
        out += ', "team": "'+s.team+'"';
        out += ', "w": '+(s.w+"").padStart(2," ");
        out += ', "d": '+(s.d+"").padStart(2," ");
        out += ', "l": '+(s.l+"").padStart(2," ");
        out += ', "f": '+(s.f+"").padStart(2," ");
        out += ', "a": '+(s.a+"").padStart(2," ");
        if ( s.pts_win ) {
            out += ', "pts_win": '+(s.pts_win+"").padStart(2," ");
        }
        out += ', "season": "'+seasonShort+'"';
        out += ', "level": "'+s.level+'"';
        out += ', "league": "'+s.league+'"';
        if ( s.champion ) {
            out += ', "champion": true';
            out += ', "title_count": '+(s.title_count+"").padStart(2," ");
            teamChampion = s.team;
        }
        if ( allPlayoffTeams.includes(s.team) ) {
             out += ', "playoff": "playoff"';
        } else if ( allLevelPlayoffTeams.includes(s.team) ) {
             out += ', "playoff": "level_playoff"';
        }
        if ( s.relegated ) {
            out += ', "relegated": true';
            teamsRelegated.push(s.team);
        }
        if ( s.promoted ) {
            out += ', "promoted": true';
            teamsPromoted.push(s.team);
        }        
        out += '}'+(s.place!==allStandings[level].length?',':'')+'\n';
    });
    out += '\t]';
    if ( teamChampion !== "" ) {
        out += ',\n\t"champion": "'+teamChampion+'"';
    }
    if ( allPlayoffs[level] ) {
         out += ',\n\t"playoff": [\n';
         for ( mm=0 ; mm!==allPlayoffs[level].length ; mm++ ) {
            m = allPlayoffs[level][mm];
            out += '\t\t'+JSON.stringify(m)
                .replaceAll('","','", "')
                .replaceAll('":"','": "')
                .replaceAll('":{','": {')
                .replaceAll('"level":','"level": ')
                .replaceAll(',"name":',', "name":')
                .replaceAll(',"series":',', "series": ')
                ;
            if ( (mm+1) !== allPlayoffs[level].length ) {
                out += ',';
            }
            out += '\n';
        };
          out += '\t]';
    }
    if ( allLevelPlayoffs[level] ) {
         out += ',\n\t"level_playoff": [\n';
         for ( mm=0 ; mm!==allLevelPlayoffs[level].length ; mm++ ) {
            m = allLevelPlayoffs[level][mm];
            out += '\t\t'+JSON.stringify(m)
                .replaceAll('","','", "')
                .replaceAll('":"','": "')
                .replaceAll('":{','": {')
                .replaceAll('"level":','"level": ')
                .replaceAll(',"name":',', "name":')
                .replaceAll(',"series":',', "series": ')
                ;
            if ( (mm+1) !== allLevelPlayoffs[level].length ) {
                out += ',';
            }
            out += '\n';
        };
          out += '\t]';
    }
    if ( teamsRelegated.length !== 0 ) {
         out += ',\n\t"relegation": {\n';
         out += '\t\t"teams": ["'+teamsRelegated.join('","')+'"],\n\t\t';

         rTarget = '"target": {';
         rNote = "Relegation from " + allStandings[level][0].league;
         rSeason = (parseInt(seasonShort.split("-")[0])+1) + "-" + (parseInt(seasonShort.split("-")[1])+1);
         rTarget += '"season": "'+prompt(rNote+": Season",rSeason)+'",';
         rLevel = parseInt(prompt(rNote+": Level",allStandings[level][0].level+1));
         rTarget += ' "level": '+rLevel+',';
         rTarget += ' "name": "'+prompt(rNote+": League",allStandings[rLevel][0].league)+'"';
         rTarget += '}';
         out += rTarget + '\n';
         out += '\t}';
         out = out.replace('"relegated": true','"relegated": true, '+rTarget);
    }
    if ( teamsPromoted.length !== 0 ) {
         out += ',\n\t"promotion": {\n';
         out += '\t\t"teams": ["'+teamsPromoted.join('","')+'"],\n\t\t';

         pTarget = '"target": {';
         pNote = "Promotion from " + allStandings[level][0].league;
         pSeason = (parseInt(seasonShort.split("-")[0])+1) + "-" + (parseInt(seasonShort.split("-")[1])+1);
         pTarget += ' "season": "'+prompt(pNote+": Season",pSeason)+'",';
         pLevel = parseInt(prompt(pNote+": Level",allStandings[level][0].level-1));
         pTarget += ' "level": '+pLevel+',';
         pTarget += ' "name": "'+prompt(pNote+": League",allStandings[pLevel][0].league)+'"';
         pTarget += '}';
         out += pTarget + '\n';
         out += '\t}';
         out = out.replace('"promoted": true','"promoted": true, '+pTarget);
    }
    if ( allMatches[level] ) {
        out += ',\n\t"matches": [\n';
        for ( mm=0 ; mm!==allMatches[level].length ; mm++ ) {
            m = allMatches[level][mm];
            out += '\t\t'+JSON.stringify(m).replaceAll('","','", "').replaceAll('":"','": "').replaceAll('":{','": {').replaceAll('"level":','"level": ').replaceAll(',"name":',', "name":');
            if ( (mm+1) !== allMatches[level].length ) {
                out += ',';
            }
            out += '\n';
        };
        out += '\t]';
    }
    out += '\n}';

    console.log('\x1B[40;93;4m     level_'+level+'.json              \x1B[m');
    console.log(out);
}

function buildSeason() {
    levels = {};
    leagues = Object.keys(allStandings);
    leagues.forEach(league=>{
        levelParts = league.split("_");
        if ( ! levels[levelParts[0]] ) {
            levels[levelParts[0]] = [];
        }
        levels[levelParts[0]].push(league);
    });

    out = '{\n';
    out += '\t\t"season": "'+seasonShort+'",\n';
    out += '\t\t"leagues": {\n';
    for ( l=0 ; l!==Object.keys(levels).length ; l++ ) {
        lvl = Object.keys(levels)[l];
        out += '\t\t\t"level_'+lvl+'": {';
        if ( levels[lvl].length === 1 ) {
            out += '"season": "'+seasonShort+'"';
            out += ', "level": '+(parseInt(lvl)+"").padStart(2," ");
            out += ', "name": "'+allStandings[lvl][0].league+'"';
            out += ', "winner": "'+allStandings[lvl][0].team+'"';
            if ( allStandings[lvl][0].title_count ) {
                out += ', "title_count": "'+allStandings[lvl][0].title_count+'"';
            }
        } else {
            out += '"season": "'+seasonShort+'"';
            out += ', "level": '+(parseInt(lvl)+"").padStart(2," ");
            out += ', "name": "'+prompt("Name for level " + lvl,allStandings[levels[lvl][0]][0].league)+'"';
            out += ', "series": [\n';
            for ( s=0 ; s!==levels[lvl].length ; s++ ) {
                lvlSerie = levels[lvl][s];
                out += '\t\t\t\t{';
                out += '"season": "'+seasonShort+'"';
                out += ', "level": '+(parseInt(lvl)+"").padStart(2," ");
                out += ', "series": '+(parseInt(lvlSerie.split("_")[1])+"").padStart(2," ");
                out += ', "name": "'+allStandings[lvlSerie][0].league+'"';
                out += ', "winner": "'+allStandings[lvlSerie][0].team+'"';
                out += '}';
                if ( s !== levels[lvl].length-1 ) {
                    out += ',';
                }
                out += '\n';
            };
            out += '\t\t\t]';
        }
        out += '}';
        if ( l !== Object.keys(levels).length-1 ) {
            out += ',\n';
        }
    };
    out += '\n\t\t}';
    out += '\n\t}';
    console.log('\x1B[40;93;4m     seasons.json              \x1B[m');
    console.log(out);
}

function build() {
    buildSeason();
    Object.keys(allStandings).forEach(s=>{
        buildLeague(s);
    });
}