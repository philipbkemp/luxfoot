const dataContainer = document.getElementById("dataContainer");
const sectionNav = document.getElementById("competitions");

let params={};
window.location.search.replace("?","").split("&").forEach(param=>{const parts=param.split("=");params[parts[0]]=parts[1];});
const club = params.club.toUpperCase();
const showSection = params.show ?? "history";
window.allTeams = [];
window.dataKeySet = [];

try {
    const [rTeams,rClub] = await Promise.all([
        fetch("data/teams.json"),
        fetch("data/clubs/"+getFolder(params.club)+"/"+params.club.toLowerCase()+".json")
    ]);
    window.allTeams = await rTeams.json();
    if ( rClub.ok ) {
        doneFetch(await rClub.json());
    } else {
        let errorP = document.createElement("P");
        errorP.classList.add("error");
        errorP.textContent = "Club not found";
        document.body.append(errorP);
    }
} catch (error) {
    handleError(error);
}

function doneFetch(data) {
    window.dataKeySet = [...window.dataKeySet,...Object.keys(data)];

    document.getElementsByTagName("H1")[0].innerHTML += data.name;
    document.title += " | " + data.name;
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'name');

    if ( data.history ) {
        let thisSectionNavHistory = document.createElement("A");
        thisSectionNavHistory.href = "club.html?club="+club+"&show=history";
        thisSectionNavHistory.innerHTML = "History";
        let thisSectionNavLiHistory = document.createElement("LI");
        thisSectionNavLiHistory.append(thisSectionNavHistory);
        if ( showSection === "history" ) {
            thisSectionNavHistory.classList.add("active");
            drawHistory(data.history,data.founded,data.refounded);
        }
        sectionNav.append(thisSectionNavLiHistory);

        window.dataKeySet = window.dataKeySet.filter(key => key !== 'history');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'founded');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'refounded');
    }

    if ( data.league ) {
        let thisSectionNavLeague = document.createElement("A");
        thisSectionNavLeague.href = "club.html?club="+club+"&show=league";
        thisSectionNavLeague.innerHTML = "League Record";
        let thisSectionNavLiLeague = document.createElement("LI");
        thisSectionNavLiLeague.append(thisSectionNavLeague);
        if ( showSection === "league" ) {
            thisSectionNavLeague.classList.add("active");
            drawStandingsTable(data.league,"league",null,null,null,{compSeries:null,isSeason:false,club:club});
        }
        sectionNav.append(thisSectionNavLiLeague);

        let thisSectionNavPosition = document.createElement("A");
        thisSectionNavPosition.href = "club.html?club="+club+"&show=chart";
        thisSectionNavPosition.innerHTML = "Position History";
        let thisSectionNavLiPosition = document.createElement("LI");
        thisSectionNavLiPosition.append(thisSectionNavPosition);
        if ( showSection === "chart" ) {
            thisSectionNavPosition.classList.add("active");
            drawChart(club);
        }
        sectionNav.append(thisSectionNavLiPosition);

        window.dataKeySet = window.dataKeySet.filter(key => key !== 'league');
    }

    if ( data.matches ) {
        let thisSectionNavMatches = document.createElement("A");
        thisSectionNavMatches.href = "club.html?club="+club+"&show=matches";
        thisSectionNavMatches.innerHTML = "Matches";
        let thisSectionNavLiMatches = document.createElement("LI");
        thisSectionNavLiMatches.append(thisSectionNavMatches);
        if ( showSection === "matches" ) {
            thisSectionNavMatches.classList.add("active");
            drawMatchRecord(data.matches);
        }
        sectionNav.append(thisSectionNavLiMatches);

        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches');
    }

    if ( window.dataKeySet.length !== 0 ) {
        console.error(window.dataKeySet.join(", "));
        console.log(data);
    }
}

function drawHistory(history,founded,refounded) {
    let historyTable = document.createElement("TABLE");
    historyTable.classList.add("club-history");
    let historyTableHead = document.createElement("THEAD");
    let historyTableHeadRow = document.createElement("TR");

    let historyTableHeadSeason = document.createElement("TH");
    historyTableHeadSeason.innerHTML = "Season";
    historyTableHeadRow.append(historyTableHeadSeason);
    let historyTableHeadEvent = document.createElement("TH");
    historyTableHeadEvent.innerHTML = "Event";
    historyTableHeadRow.append(historyTableHeadEvent);

    historyTableHead.append(historyTableHeadRow);
    historyTable.append(historyTableHead);

    let historyTableBody = document.createElement("TBODY");

    history.reverse();

    history.forEach(h=>{
        window.dataKeySet = [...window.dataKeySet,...Object.keys(h).map(key => `history.${key}`)];

        let hRow = document.createElement("TR");

        let hSeason = document.createElement("TD");
        hSeason.innerHTML = h.season;
        hRow.append(hSeason);
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.season');

        let hEvent = document.createElement("TD");
        switch (h.event) {
            case "FOUNDED":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                hEvent.innerHTML = "Club founded" + (founded ? (" " + founded) : "");
                break;
            case "REFOUNDED":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                hEvent.innerHTML = "Club re-formed" + (refounded ? (" " + refounded) : "");
                break;
            case "FOUNDED_MERGE":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.clubs');
                hEvent.innerHTML = "Club founded after merging ";
                for ( let c=0 ; c<h.clubs.length ; c++ ) {
                    if ( h.clubs.length === 2 ) {
                        if ( c !== 0 ) {
                            hEvent.innerHTML += " and ";
                        }
                    }
                    hEvent.innerHTML += window.allTeams[h.clubs[c]].name;
                }
                break;
            case "RENAME":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.new_name');
                hEvent.innerHTML = "Club renamed as " + window.allTeams[h.new_name].name;
                break;
            case "RENAME_FROM":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.old_name');
                hEvent.innerHTML = "Club renamed from " + window.allTeams[h.old_name].name;
                break;
            case "CHAMPION":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                hEvent.innerHTML = "League Champions";
                break;
            case "MERGE":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.new_name');
                hEvent.innerHTML = "Merged into " + window.allTeams[h.new_name].name;
                break;
            case "DISSOLVED":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                hEvent.innerHTML = "Club dissolved";
                break;
            case "ABSORB":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                hEvent.innerHTML = "Absorbed " + window.allTeams[h.old_name].name + " into club";
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.old_name');
                break;
            case "CUPWINNER":
                window.dataKeySet = window.dataKeySet.filter(key => key !== 'history.event');
                hEvent.innerHTML = "Cup Winners";
                break;
            default:
                console.warn("unknown event",h.event);
                break;
        }
        hRow.append(hEvent);

        historyTableBody.append(hRow);
    });

    historyTable.append(historyTableBody);
    dataContainer.append(historyTable);
}

function drawMatchRecord(matches) {
    let opponents = {};

    matches.forEach(m=>{
        window.dataKeySet = [...window.dataKeySet,...Object.keys(m).map(key => `matches.${key}`)];

        let opp;
        if ( m.home === club ) {
            opp = m.away;
        } else if ( m.away === club ) {
            opp = m.home;
        } else {
            console.warn("Inconsistent match - team not found",m);
            return;
        }

        if ( ! opponents[opp] ) {
            opponents[opp] = {
                "_name": window.allTeams[opp].name,
                "w":0,
                "d":0,
                "l":0,
                "f":0,
                "a":0
            }
        }

        const score = m.score.split("-");
        let homeScoreParsed = Number.parseInt(score[0]);
        let awayScoreParsed = Number.parseInt(score[1]);
        let homeScore = Number.isNaN(homeScoreParsed) ? -1 : homeScoreParsed;
        let awayScore = Number.isNaN(awayScoreParsed) ? -1 : awayScoreParsed;
        if ( homeScore !== -1 && awayScore !== -1 ) {
            if ( m.home === club ) {
                opponents[opp].f += homeScore;
                opponents[opp].a += awayScore;
                if ( homeScore > awayScore ) {
                    opponents[opp].w++;
                } else if ( homeScore < awayScore ) {
                    opponents[opp].l++;
                } else if ( homeScore === awayScore) {
                    opponents[opp].d++;
                }
            } else if ( m.away === club ) {
                opponents[opp].f += awayScore;
                opponents[opp].a += homeScore;
                if ( homeScore > awayScore ) {
                    opponents[opp].l++;
                } else if ( homeScore < awayScore ) {
                    opponents[opp].w++;
                } else if ( homeScore === awayScore) {
                    opponents[opp].d++;
                }
            }
        }

        if ( m.replay ) {
            window.dataKeySet = [...window.dataKeySet,...Object.keys(m.replay).map(key => `matches.replay.${key}`)];
            const rScore = m.replay.score.split("-");
            let homeReplayScoreParsed = Number.parseInt(rScore[0]);
            let awayReplayScoreParsed = Number.parseInt(rScore[1]);
            let homeRScore = Number.isNaN(homeReplayScoreParsed) ? -1 : homeReplayScoreParsed;
            let awayRScore = Number.isNaN(awayReplayScoreParsed) ? -1 : awayReplayScoreParsed;
            if ( homeRScore !== -1 && awayRScore !== -1 ) {
                if ( m.home === club ) {
                    opponents[opp].f += homeRScore;
                    opponents[opp].a += awayRScore;
                    if ( homeRScore > awayRScore ) {
                        opponents[opp].w++;
                    } else if ( homeRScore < awayRScore ) {
                        opponents[opp].l++;
                    } else if ( homeRScore === awayRScore) {
                        opponents[opp].d++;
                    }
                } else if ( m.away === club ) {
                    opponents[opp].f += awayRScore;
                    opponents[opp].a += homeRScore;
                    if ( homeRScore > awayRScore ) {
                        opponents[opp].l++;
                    } else if ( homeRScore < awayRScore ) {
                        opponents[opp].w++;
                    } else if ( homeRScore === awayRScore) {
                        opponents[opp].d++;
                    }
                }
            }
        }

        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.home')
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.away');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.score');

        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.replay');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.replay.score');

        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.season');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.competition');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.date');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.outcome');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.forfeit');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.note');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.homeDivision');
        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.awayDivision');
    });

    let mt = document.createElement("TABLE");
    mt.classList.add("opponents");
    let mtHead = document.createElement("THEAD");
    let mtHeadRow = document.createElement("TR");

    let mtHeadOpp = document.createElement("TH");
    mtHeadOpp.innerHTML = "Opponent";
    mtHeadRow.append(mtHeadOpp);

    const cols = ["P","W","D","L","F","A","Pts","GD","W%","PPG"];
    const colsAbbr = ["Played","Won","Drawn","Lost","For","Against","Points","Goal difference","Win Percentage","Points Per Game"];
    for ( let i=0 ; i<cols.length ; i++ ) {
        let thCol = document.createElement("TH");
        thCol.innerHTML = "<abbr title='"+colsAbbr[i]+"'>"+cols[i]+"</abbr>";
        mtHeadRow.append(thCol);
    }

    mtHead.append(mtHeadRow);
    mt.append(mtHead);
    let mtBody = document.createElement("TBODY");

    Object.keys(opponents)
    .sort((a, b) => opponents[a]._name.localeCompare(opponents[b]._name))
    .forEach(opp=>{

        const played = opponents[opp].w + opponents[opp].d +opponents[opp].l;
        if ( played !== 0 ) {
            let oppRow = document.createElement("TR");

            let oppName = document.createElement("TD");
            oppName.innerHTML = opponents[opp]._name;
            oppRow.append(oppName);

            const points = (opponents[opp].w * 3) + opponents[opp].d;

            let oppPlayed = document.createElement("TD");
            oppPlayed.innerHTML = played;
            oppRow.append(oppPlayed);

            ["w","d","l","f","a"].forEach(col=>{
                let oppStat = document.createElement("TD");
                oppStat.innerHTML = opponents[opp][col];
                oppRow.append(oppStat);
            });

            let oppPoints = document.createElement("TD");
            oppPoints.innerHTML = points;
            oppRow.append(oppPoints);

            let oppDiff = document.createElement("TD");
            oppDiff.innerHTML = opponents[opp].f - opponents[opp].a;
            oppRow.append(oppDiff);

            let oppWinPerc = document.createElement("TD");
            oppWinPerc.innerHTML = ((opponents[opp].w / played) * 100).toFixed(2);
            oppRow.append(oppWinPerc);

            let oppPpg = document.createElement("TD");
            oppPpg.innerHTML = (points / played).toFixed(2);
            oppRow.append(oppPpg);

            mtBody.append(oppRow);
        }
    });

    mt.append(mtBody);

    let note = document.createElement("P");
    note.innerHTML = "Note: Assumes 3 points for a win for all matches";
    dataContainer.append(note);

    dataContainer.append(mt);
}

function getFolder(name) {
    const c = name[0].toUpperCase();
    let range;
    if (c <= 'G') range = 'A-G';
    else if (c <= 'N') range = 'H-N';
    else if (c <= 'U') range = 'O-U';
    else range = 'V-Z';

    return (`${range}/${c}`).toUpperCase();
}