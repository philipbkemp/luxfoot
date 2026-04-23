let params={};
window.location.search.replace("?","").split("&").forEach(param=>{const parts=param.split("=");params[parts[0]]=parts[1];});
const season = params.year;
const seasonPath = [season[0]+""+season[1],season[2],season[3]+"-"+season.split("-")[1]];
const showComp = params.comp ?? "league:1";
const compNav = document.getElementById("competitions");

window.allTeams = null;

window.intPlayers = null;
let contentShown = false;
window.dataKeySet = [];

window.rawData = {};

try {
    const [rTeams,rIntPlayers,rSeason] = await Promise.all([
        fetch("data/teams.json"),
        fetch("data/intplayers.json"),
        fetch("data/"+seasonPath.join("/")+".json")
    ]);
    window.allTeams = await rTeams.json();
    window.intPlayers = await rIntPlayers.json();
    if ( rSeason.ok ) {
        doneFetch(await rSeason.json());
    } else {
        let errorP = document.createElement("P");
        errorP.classList.add("error");
        errorP.textContent = "Season not found";
        document.body.append(errorP);
    }
} catch (error) {
    handleError(error);
}

function doneFetch(data) {
    window.rawData = data;
    window.dataKeySet = [...window.dataKeySet,...Object.keys(data)];

    document.getElementsByTagName("H1")[0].innerHTML += data.season;
    document.title += " | " + data.season;
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'season');

    const prevNext = document.getElementById("prev-next");
    let goPrev = null;
    let goNext = null;
    if ( data.prev ) {
        goPrev = document.createElement("A");
        goPrev.href = "season.html?year="+data.prev+"&comp="+showComp;
        goPrev.innerHTML = data.prev;
        let goPrevLi = document.createElement("LI");
        goPrevLi.append(goPrev);
        prevNext.append(goPrevLi);
    }
    if ( data.next ) {
        goNext = document.createElement("A");
        goNext.href = "season.html?year="+data.next+"&comp="+showComp;
        goNext.innerHTML = data.next;
        let goNextLi = document.createElement("LI");
        goNextLi.append(goNext);
        prevNext.append(goNextLi);
    }
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'next');
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'prev');

    let playoffsNeeded = [];
    let playoffsReallyNeeded = [];

    if ( data.league ) {
        data.league.forEach(league=>{
            playoffsNeeded = [...playoffsNeeded,...drawLeague(league,"league")];
        });
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'league');
    }

    if ( data.playoffs ) {
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'playoffs');
        playoffsNeeded.forEach(pon=>{
            if ( pon.includes("|") ) {
                pon.split("|").forEach(pon_a=>{
                    if ( ! playoffsReallyNeeded.includes(pon_a) ) {
                        playoffsReallyNeeded.push(pon_a);
                    }
                });
            } else if ( ! playoffsReallyNeeded.includes(pon) ) {
                playoffsReallyNeeded.push(pon);
            }
        });

        Object.keys(data.playoffs).forEach(po=>{
            drawPlayoff(po,data.playoffs[po],playoffsReallyNeeded.includes(po),"playoffs."+po);
            playoffsReallyNeeded = playoffsReallyNeeded.filter(key => key !== po);
        });
    }

    if ( data.international ) {
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'international');
        Object.keys(data.international).forEach(int=>{
            drawInternational(int,data.international[int]);
        });
    }

    if ( data.cup ) {
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'cup');
        Object.keys(data.cup).forEach(cupData=>{
            drawCup(cupData,data.cup[cupData]);
        });
    }

    if ( ! contentShown ) {
        let errorP = document.createElement("P");
        errorP.classList.add("error");
        errorP.textContent = "Competition not found";
        document.body.append(errorP);
        goPrev.href = "season.html?year="+data.prev;
        goNext.href = "season.html?year="+data.next;
    }

    if ( window.dataKeySet.length !== 0 ) {
        console.error(window.dataKeySet.join(", "));
        console.log(data);
    }
    if ( playoffsReallyNeeded.length !== 0 ) {
        console.error("PLAYOFFS MISSING",playoffsReallyNeeded.join(", "));
        console.log(data.playoffs);
    }
}

function drawCup(cupKey,cupData) {
    window.dataKeySet = [...window.dataKeySet,...Object.keys(cupData).map(key => `cup.${cupKey}.${key}`)];

    const thisComp = "cup:" + cupKey;
    let thisCupNav = document.createElement("A");
    thisCupNav.href = "season.html?year="+season+"&comp="+thisComp;
    thisCupNav.innerHTML = cupData.name
    window.dataKeySet = window.dataKeySet.filter(key => key !== `cup.${cupKey}.name`);
    if ( thisComp === showComp ) {
        thisCupNav.classList.add("active");
    }
    let thisCupLi = document.createElement("LI");
    thisCupLi.append(thisCupNav);
    compNav.append(thisCupLi);

    window.dataKeySet = window.dataKeySet.filter(key => key !== `cup.${cupKey}.rounds`);

    if ( showComp !== thisComp ) {
        return;
    }
    contentShown = true;

    let clubDivisions = {};

    cupData.rounds.forEach(round=>{
        window.dataKeySet = [...window.dataKeySet,...Object.keys(round).map(key => `cup.${cupKey}.round.${key}`)];

        let cupTitle = document.createElement("H2");
        cupTitle.innerHTML = round.name;
        dataContainer.append(cupTitle);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `cup.${cupKey}.round.name`);

        window.dataKeySet = window.dataKeySet.filter(key => key !== `cup.${cupKey}.round.matches`);
        drawMatches(round.matches,`cup.${cupKey}.round.match`,{type:"cup",cup:cupData.name,cup_code:cupKey,round:round.name},{season:season,showDiv:true,highlightWinner:true});

        round.matches.forEach(m=>{
            if ( m.bye ) {
                if ( clubDivisions[m.bye] === undefined ) {
                    clubDivisions[m.bye] = getTeamLevel(m.bye);
                }
                if ( m.byeDivision !== clubDivisions[m.bye] ) {
                    console.warn("Inconsistent division in " + m.competition.round_code,m.bye);
                }
            } else {
                if ( clubDivisions[m.home] === undefined ) {
                    clubDivisions[m.home] = getTeamLevel(m.home);
                }
                if ( m.homeDivision !== clubDivisions[m.home] ) {
                    console.warn("Inconsistent division in " + m.competition.round_code,m.home);
                }
                if ( clubDivisions[m.away] === undefined ) {
                    clubDivisions[m.away] = getTeamLevel(m.away);
                }
                if ( m.awayDivision !== clubDivisions[m.away] ) {
                    console.warn("Inconsistent division in " + m.competition.round_code,m.away);
                }
            }
        });

    });

}

function getTeamLevel(searchTeam) {
    for ( const l of window.rawData.league ) {
        if ( l.standings ) {
            for ( const tt of l.standings ) {
                if ( tt.team === searchTeam ) {
                    return tt.competition.level;
                }
            };
        } else if ( l.series ) {
            for ( const s of l.series ) {
                for ( const ts of s.standings ) {
                    if ( ts.team === searchTeam ) {
                        return ts.competition.level;
                    }
                };
            };
        }
    };
    console.error("Cannot find league",searchTeam);
}

function drawInternational(intKey,intData) {
    window.dataKeySet = [...window.dataKeySet,...Object.keys(intData).map(key => `international.${intKey}.${key}`)];
    window.dataKeySet = window.dataKeySet.filter(key => key !== `international.${intKey}.matches`);

    const thisComp = "international:" + intKey;
    let thisLeagueNav = document.createElement("A");
    thisLeagueNav.href = "season.html?year="+season+"&comp="+thisComp;
    switch ( intKey ) {
        case "men":
            thisLeagueNav.innerHTML = "Men's National Team";
            window.dataKeySet = window.dataKeySet.filter(key => key !== 'international.men');
            break;
        case "women":
            thisLeagueNav.innerHTML = "Women's National Team";
            window.dataKeySet = window.dataKeySet.filter(key => key !== 'international.women');
            break;
    }
    if ( thisComp === showComp ) {
        thisLeagueNav.classList.add("active");
    }
    let thisLeagueNavLi = document.createElement("LI");
    thisLeagueNavLi.append(thisLeagueNav);
    compNav.append(thisLeagueNavLi);

    if ( showComp !== thisComp ) {
        return;
    }
    contentShown = true;

    if ( intData.matches ) {

        let matchesTitle = document.createElement("H3");
        matchesTitle.innerHTML = "Matches";
        dataContainer.append(matchesTitle);
        drawMatches(intData.matches,`international.${intKey}`,{"type":"international"},{hasIntData:true,season:season});
    }
}

function drawPlayoff(code,po,isShown,keyPrefix) {
    window.dataKeySet = [...window.dataKeySet,...Object.keys(po).map(key => `${keyPrefix}.${key}`)];
    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.matches`);
    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.note`);
    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.noteTeams`);

    if ( ! isShown ) {
        return;
    }

    let playoffTitle = document.createElement("H2");
    playoffTitle.innerHTML = getPlayoffName(code);
    dataContainer.append(playoffTitle);

    if ( po.matches ) {
        drawMatches(po.matches,keyPrefix+".matches",{"type":"playoff","playoff":code},{season:season});
    }

    if ( po.note ) {
        let note = document.createElement("P");
        note.innerHTML = "Note: " + po.note;
        if ( po.noteTeams ) {
            po.noteTeams.forEach(nt=>{
                note.innerHTML = note.innerHTML.replaceAll(nt,window.allTeams[nt].name);
            });
        }
        dataContainer.append(note);
    }
}

function drawLeague(league,keyPrefix) {
    window.dataKeySet = [...window.dataKeySet,...Object.keys(league).map(key => `${keyPrefix}.${key}`)];

    const thisComp = "league:" + league.level;

    let thisLeagueNav = document.createElement("A");
    thisLeagueNav.href = "season.html?year="+season+"&comp="+thisComp;
    thisLeagueNav.innerHTML = league.name;
    let thisLeagueNavLi = document.createElement("LI");
    thisLeagueNavLi.append(thisLeagueNav);
    if ( thisComp === showComp ) {
        thisLeagueNav.classList.add("active");
    }
    compNav.append(thisLeagueNavLi);

    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.name`);
    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.level`);
    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.note`);
    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.standings`);
    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.pts_win`);
    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.matches`);
    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.series`);

    if ( showComp !== thisComp ) {
        return [];
    }
    contentShown = true;

    let playoffsNeeded = [];
    const dataContainer = document.getElementById("dataContainer");

    if ( ! league.series ) {
        let leagueName = document.createElement("H2");
        leagueName.innerHTML = league.name;
        dataContainer.append(leagueName);
    }

    if ( league.note ) {
        let note = document.createElement("P");
        note.innerHTML = "Note: " + league.note;
        dataContainer.append(note);
    }

    if ( league.pts_win ) {
        let notePts = document.createElement("P");
        notePts.innerHTML = "Note: " + league.pts_win + " points for a win";
        dataContainer.append(notePts);
    }

    if ( league.standings ) {
        let standingTitle = document.createElement("H3");
        standingTitle.innerHTML = "Standings";
        dataContainer.append(standingTitle);
        playoffsNeeded = drawStandingsTable(league.standings,keyPrefix+".standings","league",league.level,league.name,{checkSeason:season});
    }

    let expectedStandings = {};

    if ( league.matches ) {
        let matchesTitle = document.createElement("H3");
        matchesTitle.innerHTML = "Matches";
        dataContainer.append(matchesTitle);
        expectedStandings = drawMatchesGrid(league.matches,keyPrefix+".matches","league",league.level,league.name);
    }

    if ( league.standings && league.matches ) {
        const sorted1 = [...league.standings].sort((a, b) => a.team.localeCompare(b.team));
        const sorted2 = Object.values(expectedStandings).sort((a, b) => a.team.localeCompare(b.team));
        compare(sorted1,sorted2);
    }

    if ( league.series ) {
        playoffsNeeded = drawSeries(league.series,keyPrefix+".series",league);
    }

    return playoffsNeeded;
}

function compare(sorted1,sorted2) {
    const standingsMatchGrid = sorted1.every((item, i) => {
        const other = sorted2[i];
        return (
            item.team === other.team &&
            item.w === other.w &&
            item.d === other.d &&
            item.l === other.l
        );
    });
    if ( ! standingsMatchGrid ) {
        console.error("Standings != Grid",sorted1,sorted2);
    }
}

function drawSeries(series,keyPrefix,league) {
    let playoffsNeeded = [];

    series.forEach(serie=>{
        window.dataKeySet = [...window.dataKeySet,...Object.keys(serie).map(key => `${keyPrefix}.${key}`)];

        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.serie`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.name`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.pts_win`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.standings`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.matches`);

        let seriesName = document.createElement("H2");
        seriesName.innerHTML = league.name + " " + serie.name;
        dataContainer.append(seriesName);

        if ( serie.standings ) {
            let standingTitle = document.createElement("H3");
            standingTitle.innerHTML = "Standings";
            dataContainer.append(standingTitle);
            playoffsNeeded = [
                ...playoffsNeeded,
                ...drawStandingsTable(serie.standings,keyPrefix+".standings","league_series",league.level,seriesName.innerHTML,{compSeries:serie.serie,checkSeason:season})
            ];
        }

        let expectedStandings = {};

        if ( serie.matches ) {
            let matchesTitle = document.createElement("H3");
            matchesTitle.innerHTML = "Matches";
            dataContainer.append(matchesTitle);
            expectedStandings = drawMatchesGrid(serie.matches,keyPrefix+".matches","league_series",league.level,seriesName.innerHTML,serie.serie)
        }

        if ( serie.standings && serie.matches ) {
            const sorted1 = [...serie.standings].sort((a, b) => a.team.localeCompare(b.team));
            const sorted2 = Object.values(expectedStandings).sort((a, b) => a.team.localeCompare(b.team));
            compare(sorted1,sorted2);
        }

        if ( serie.pts_win !== league.pts_win ) {
            console.warn("Inconsistent points per win definition",serie.pts_win,league.pts_win);
        }
    });

    return playoffsNeeded;
}

function drawMatchesGrid(matches,keyPrefix,compType,compLevel,compName,compSeries=0) {
    let grid = [];
    let expectedStandings = [];
    let gridNotes = [];

    matches.forEach(match=>{
        window.dataKeySet = [...window.dataKeySet,...Object.keys(match).map(key => `${keyPrefix}.${key}`)];
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.home`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.away`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.score`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.season`);

        if ( match.competition ) {
            window.dataKeySet = [...window.dataKeySet,...Object.keys(match.competition).map(key => `${keyPrefix}.competition.${key}`)];
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition`);
            if ( match.competition.type === "league" || match.competition.type === "league_series" ) {
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.type`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.level`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.league`);
            }
            if (match.competition.type === "league_series" ) {
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.series`);
            }
        }

        if ( ! grid[match.home] ) {
            grid[match.home] = [];
        }
        if ( match.forfeit ) {
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.forfeit`);
            let gridScoreFF = document.createElement("ABBR");
            gridScoreFF.title = "Match forfeited";
            gridScoreFF.innerHTML = match.score;
            grid[match.home][match.away] = gridScoreFF.outerHTML;
            gridNotes.push("Match between "+window.allTeams[match.home].name+" and "+window.allTeams[match.away].name+" awarded as forfeit: "+match.score);
        } else if ( match.note ) {
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.note`);
            let gridScoreNote = document.createElement("ABBR");
            gridScoreNote.title = "Note: see below";
            gridScoreNote.innerHTML = match.score;
            grid[match.home][match.away] = gridScoreNote.outerHTML;
            gridNotes.push("Match between "+window.allTeams[match.home].name+" and "+window.allTeams[match.away].name+": "+match.note);
        } else {
            grid[match.home][match.away] = match.score;
        }

        if ( season !== match.season ) {
            console.warn("inconsistent season value",season,match.season);
        }
        if ( compType !== match.competition.type ) {
            console.warn("inconsistent competition type",compType,match.competition.type);
        }
        if ( (compType === "league" || compType === "league_series") && compLevel !== match.competition.level ) {
            console.warn("inconsistent competition league level",compLevel,match.competition.level);
        }
        if ( (compType === "league" || compType === "league_series") && compName !== match.competition.league ) {
            console.warn("inconsistent competition league name",compName,match.competition.league);
        }
        if ( compType === "league_series" && compSeries !== match.competition.series ) {
            console.warn("inconsistent competition league series",compSeries,match.competition.series);
        }

        if ( ! expectedStandings[match.home] ) {
            expectedStandings[match.home] = {};
            expectedStandings[match.home].team = match.home;
            expectedStandings[match.home].w = 0;
            expectedStandings[match.home].d = 0;
            expectedStandings[match.home].l = 0;
            expectedStandings[match.home].f = 0;
            expectedStandings[match.home].a = 0;
        }
        if ( ! expectedStandings[match.away] ) {
            expectedStandings[match.away] = {};
            expectedStandings[match.away].team = match.away;
            expectedStandings[match.away].w = 0;
            expectedStandings[match.away].d = 0;
            expectedStandings[match.away].l = 0;
            expectedStandings[match.away].f = 0;
            expectedStandings[match.away].a = 0;
        }
        const scoreParts = match.score.split("-");
        const homeScore = Number.parseInt(scoreParts[0]);
        const awayScore = Number.parseInt(scoreParts[1]);
        expectedStandings[match.home].f += homeScore;
        expectedStandings[match.home].a += awayScore;
        expectedStandings[match.away].f += awayScore;
        expectedStandings[match.away].a += homeScore;
        if ( homeScore > awayScore ) {
            expectedStandings[match.home].w++;
            expectedStandings[match.away].l++;
        } else if ( homeScore < awayScore ) {
            expectedStandings[match.home].l++;
            expectedStandings[match.away].w++;
        } else {
            expectedStandings[match.home].d++;
            expectedStandings[match.away].d++;
        }
    });

    const dataContainer = document.getElementById("dataContainer");
    let table = document.createElement("TABLE");
    table.classList.add("matchgrid");

    let thead = document.createElement("THEAD");
    let trHead = document.createElement("TR");
    let thHome = document.createElement("TH");
    thHome.innerHTML = "";
    trHead.append(thHome);

    const teams = Object.keys(grid).sort((a, b) => a.localeCompare(b, "en-US", { sensitivity: "base" }));
    teams.forEach(t=>{
        let thTeam = document.createElement("TH");
        thTeam.innerHTML = "<abbr title='"+window.allTeams[t].name+"'>"+t+"</abbr>";
        trHead.append(thTeam);
    });

    thead.append(trHead);
    table.append(thead);

    let tbody = document.createElement("TBODY");
    teams.forEach(t=>{
        let tr = document.createElement("TR");
        let trTeam = document.createElement("TD");
        trTeam.innerHTML = window.allTeams[t].name;
        tr.append(trTeam);

        teams.forEach(tt=>{
            let trMatch = document.createElement("TD");
            trMatch.innerHTML = "-";
            if ( t !== tt ) {
                trMatch.innerHTML = grid[t][tt];
            }
            tr.append(trMatch);
        });

        tbody.append(tr);
    });
    table.append(tbody);

    dataContainer.append(table);

    if ( gridNotes.length !== 0 ) {
        let gridNoteUl = document.createElement("UL");
        gridNotes.forEach(gn=>{
            let gridNoteLi = document.createElement("LI");
            gridNoteLi.innerHTML = gn;
            gridNoteUl.append(gridNoteLi);
        });
        dataContainer.append(gridNoteUl);
    }

    return expectedStandings;
}