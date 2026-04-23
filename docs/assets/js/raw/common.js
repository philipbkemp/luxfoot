let clubsPos = [];

function handleError(err) {
    let errorP = document.createElement("P");
    errorP.classList.add("error");
    errorP.textContent = "Something broke";
    document.body.append(errorP);
    console.error(err);
}

function getClubsPipe() {
    let pipe = [];
    clubsPos.forEach(cp=>{
        if ( cp ) {
            pipe.push('"'+cp.join("|")+'"');
        }
        cp.forEach(club=>{
            let clubMatches = "";
            let clubStanding = "";
            window.rawData.league.forEach(a=>{
                if ( a.matches ) {
                    a.matches.forEach(b=>{
                        if ( b.home === club || b.away === club ) {
                            clubMatches += JSON.stringify(b) + ",\n";
                        }
                    });
                }
                if ( a.standings ) {
                    a.standings.forEach(b=>{
                        if ( b.team === club ) {
                            clubStanding = JSON.stringify(b);
                        }
                    });
                }
                if ( a.series ) {
                    a.series.forEach(b=>{
                        if ( b.matches ) {
                            b.matches.forEach(c=>{
                                if ( c.home === club || c.away === club ) {
                                    clubMatches += JSON.stringify(c) + ",\n";
                                }
                            });
                        }
                        if ( b.standings ) {
                            b.standings.forEach(c=>{
                                if ( c.team === club ) {
                                    clubStanding = JSON.stringify(c);
                                }
                            });
                        }
                    });
                }
            });
            Object.keys(window.rawData.cup).forEach(a=>{
                window.rawData.cup[a].rounds.forEach(b=>{
                    b.matches.forEach(c=>{
                        if ( (c.home && c.home === club) || ( c.away && c.away === club ) ) {
                            clubMatches += JSON.stringify(c) + ",\n";
                        }
                    });
                });
            });
            console.warn(club);
            if ( clubStanding !== "" ) { console.log(clubStanding) };
            if ( clubMatches !== "" ) { console.log(clubMatches); }
        });
    });
    console.log("["+pipe.join(",")+"]");
}

function drawStandingsTable(standings,keyPrefix,compType,compLevel,compName,options={}) {
    const {compSeries=0,isSeason=true,checkSeason="",club=""} = options;
    const dataContainer = document.getElementById("dataContainer");

    let playoffsNeeded = [];

    let table = document.createElement("TABLE");
    table.classList.add("standings");

    let thead = document.createElement("THEAD");
    let trHead = document.createElement("TR");

    if ( ! isSeason ) {
        let thSeason = document.createElement("TH");
        thSeason.innerHTML = "Season";
        trHead.append(thSeason);
        table.classList.add("standings-history");
    }

    let thPlace = document.createElement("TH");
    thPlace.innerHTML = "#";
    trHead.append(thPlace);
    if ( ! isSeason ) {
        thPlace.innerHTML = "Level / #";
        thPlace.setAttribute("colspan",6);
    }

    let thTeam = document.createElement("TH");
    thTeam.innerHTML = "Team";
    trHead.append(thTeam);
    const cols = ["P","W","D","L","F","A","Pts","GD"];
    const colsAbbr = ["Played","Won","Drawn","Lost","For","Against","Points","Goal difference"];
    for ( let i=0 ; i<cols.length ; i++ ) {
        let thCol = document.createElement("TH");
        thCol.innerHTML = "<abbr title='"+colsAbbr[i]+"'>"+cols[i]+"</abbr>";
        trHead.append(thCol);
    }
    let thNotes = document.createElement("TH");
    thNotes.innerHTML = "Notes";
    trHead.append(thNotes);
    thead.append(trHead);
    table.append(thead);

    let hasNotes = false;

    let totalWins = 0;
    let totalDraws = 0;
    let totalLosses = 0;
    let totalFor = 0;
    let totalAgainst = 0;

    let tbody = document.createElement("TBODY");
    standings.forEach((standing,index)=>{
        window.dataKeySet = [...window.dataKeySet,...Object.keys(standing).map(key => `${keyPrefix}.${key}`)];
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.place`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.team`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.missing`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.season`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.playoff`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.champion`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.w`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.d`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.l`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.f`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.a`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.pts_win`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.relegated`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.promoted`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.removed`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.note`);

        if ( standing.competition ) {
            window.dataKeySet = [...window.dataKeySet,...Object.keys(standing.competition).map(key => `${keyPrefix}.competition.${key}`)];
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition`);
            if ( standing.competition.type === "league" || standing.competition.type === "league_series" ) {
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.type`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.level`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.league`);
            }
            if ( standing.competition.type === "league_series" ) {
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.series`);
            }
        }

        let tr = document.createElement("TR");

        if ( standing.gap ) {
            let gapTd = document.createElement("TD");
            gapTd.setAttribute("colspan",20);
            gapTd.classList.add("gap-year");
            tr.append(gapTd);
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.gap`);
        } else {

            if ( ! isSeason ) {
                let tdSeason = document.createElement("TD");
                tdSeason.innerHTML = standing.season;
                tr.append(tdSeason);
            }

            if ( isSeason ) {
                let tdPlace = document.createElement("TD");
                tdPlace.innerHTML = standing.place;
                tr.append(tdPlace);
                if ( ! clubsPos[standing.place] ) {
                    clubsPos[standing.place] = [];
                }
                clubsPos[standing.place].push(standing.team);
            } else {
                for ( let i=1 ; i<7 ; i++ ) {
                    let tdPlace = document.createElement("TD");
                    if ( standing.competition.level === i ) {
                        tdPlace.innerHTML = standing.place;
                    }
                    tr.append(tdPlace);
                }
            }

            let tdTeam = document.createElement("TD");
            if ( isSeason ) {
                tdTeam.innerHTML = window.allTeams[standing.team].name;
            } else {
                tdTeam.innerHTML = standing.competition.league;
            }
            tr.append(tdTeam);

            if ( standing.missing ) {
                let tdMissing = document.createElement("TD");
                tdMissing.innerHTML = "no data";
                tdMissing.colSpan = cols.length;
                tr.append(tdMissing);
            } else {

                let tdP = document.createElement("TD");
                tdP.innerHTML = standing.w + standing.d + standing.l;
                tr.append(tdP);

                let tdW = document.createElement("TD");
                tdW.innerHTML = standing.w;
                tr.append(tdW);

                let tdD = document.createElement("TD");
                tdD.innerHTML = standing.d;
                tr.append(tdD);

                let tdL = document.createElement("TD");
                tdL.innerHTML = standing.l;
                tr.append(tdL);

                let tdF = document.createElement("TD");
                tdF.innerHTML = standing.f;
                tr.append(tdF);

                let tdA = document.createElement("TD");
                tdA.innerHTML = standing.a;
                tr.append(tdA);

                let tdPts = document.createElement("TD");
                tdPts.innerHTML = (standing.w*(standing.pts_win?standing.pts_win:3))+standing.d;
                tr.append(tdPts);

                let tdGd = document.createElement("TD");
                tdGd.innerHTML = standing.f - standing.a;
                tr.append(tdGd);

                totalWins += standing.w;
                totalDraws += standing.d;
                totalLosses += standing.l;
                totalFor += standing.f;
                totalAgainst += standing.a;

            }

            let tdNotes = document.createElement("TD");
            tdNotes.innerHTML = "";
            if ( isSeason && standing.playoff ) {
                tdNotes.innerHTML += (tdNotes.innerHTML == "" ? "" : " | ") + "-> " + getPlayoffName(standing.playoff);
                playoffsNeeded.push(standing.playoff);
                standing.playoff.split("|").forEach(poclass=>{
                    tr.classList.add("to-playoff--"+poclass);
                });
                hasNotes = true;
            }
            tr.append(tdNotes);

            if ( standing.champion ) {
                tr.classList.add("is-champion");
                tdNotes.innerHTML += (tdNotes.innerHTML == "" ? "" : " | ") + "Champion";
                hasNotes = true;
            }

            if ( standing.relegated ) {
                tr.classList.add("is-relegated");
                tdNotes.innerHTML += (tdNotes.innerHTML == "" ? "" : " | ") + "Relegated";
                hasNotes = true;
            }
            if ( standing.promoted ) {
                tr.classList.add("is-promoted");
                tdNotes.innerHTML += (tdNotes.innerHTML == "" ? "" : " | ") + "Promoted";
                hasNotes = true;
            }
            if ( standing.removed ) {
                tr.classList.add("is-removed");
                tdNotes.innerHTML += (tdNotes.innerHTML == "" ? "" : " | ") + "Removed";
                hasNotes = true;
            }


            if ( standing.note ) {
                tdNotes.innerHTML += (tdNotes.innerHTML === "" ? "" : " | ") + standing.note;
                hasNotes = true;
            }

            if ( isSeason ) {
                if ( (index+1) !== standing.place ) {
                    console.warn("inconsistent place value",index,standing.place);
                }

                if ( checkSeason !== standing.season ) {
                    console.warn("inconsistent season value",checkSeason,standing.season);
                }
                if ( compType !== standing.competition.type ) {
                    console.warn("inconsistent competition type",compType,standing.competition.type);
                }
                if ( (compType === "league" || compType === "league_series") && compLevel !== standing.competition.level ) {
                    console.warn("inconsistent competition league level",compLevel,standing.competition.level);
                }
                if ( (compType === "league" || compType === "league_series") && compName !== standing.competition.league ) {
                    console.warn("inconsistent competition league name",compName,standing.competition.league);
                }
                if ( compType === "league_series" && compSeries !== standing.competition.series ) {
                    console.warn("inconsistent competition league series",compSeries,standing.competition.series);
                }
            }
        }

        if ( ! isSeason && ! standing.gap && standing.team !== club ) {
            console.warn("Inconsistent club",standing.season,standing.team,club);
        }

        tbody.append(tr);
    });
    table.append(tbody);

    if ( hasNotes ) {
        table.classList.add("notes__some");
    } else {
        table.classList.add("notes__none");
    }

    if ( isSeason ) {
        if ( totalWins !== totalLosses ) {
            console.error("Wins != Losses",totalWins,totalLosses);
        }
        if ( totalFor !== totalAgainst ) {
            console.error("For != Against",totalFor,totalAgainst);
        }
        if ( totalDraws % 2 !== 0 ) {
            console.error("Uneven number of draws",totalDraws);
        }
    }

    dataContainer.append(table);

    return playoffsNeeded;
}

function getPlayoffName(po) {
    let poName = po;

    switch (po) {
        case "promotion_2":
        case "promotion_3":
            poName = "Promotion playoff";
            break;

        case "title":
            poName = "Title decider";
            break;

        case "title_3_S":
            poName = "Title decider (3. Division Series South)";
            break;

        case "title_playoff":
            poName = "Title playoff";
            break;

        default:
            if ( po.includes("|") ) {
                return getPlayoffName(po.split("|")[0]);
            } else {
                console.warn("Unsupported playoff",po);
            }
    }

    return poName;
}

function getMatchCategory(cat) {
    switch ( cat ) {
        case "M": return "Men";
        case "W": return "Women";
    }
    return cat;
}

function drawMatches(matches,keyPrefix,comp,options={}) {
    const {hasIntData=false,isSeason=true,compColumn=false,focusPlayer="",season="",showDiv=false,highlightWinner=false} = options;
    const dataContainer = document.getElementById("dataContainer");

    let table = document.createElement("TABLE");
    table.classList.add("matches");
    if ( hasIntData ) {
        table.classList.add("matches--extradata");
    }

    let hasDates = false;
    let hasNotes = false;

    matches.forEach(match=>{
        window.dataKeySet = [...window.dataKeySet,...Object.keys(match).map(key => `${keyPrefix}.${key}`)];
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.date`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.home`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.away`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.score`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.season`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.outcome`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.forfeit`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.result`);
        window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.note`);

        if ( hasIntData ) {
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.goals`);
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.stadium`);
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.location`);
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.attendance`);
        }

        if ( match.competition ) {
            window.dataKeySet = [...window.dataKeySet,...Object.keys(match.competition).map(key => `${keyPrefix}.competition.${key}`)];
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition`);
            if ( match.competition.type === "playoff" ) {
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.type`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.playoff`);
            } else if ( match.competition.type === "international" ) {
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.type`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.international`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.category`);
            } else if ( match.competition.type === "cup" ) {
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.homeDivision`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.awayDivision`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.type`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.cup`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.cup_code`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.round`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.round_code`);
            }
        }

        let tr = document.createElement("TR");

        if ( match.bye ) {
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.bye`);
            window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.byeDivision`);

            let tdBye = document.createElement("TD");
            tdBye.setAttribute("colspan",10);
            tdBye.classList.add("match-bye");
            tdBye.innerHTML = "Bye: " + window.allTeams[match.bye].name + " (" + match.byeDivision + ")";
            tr.append(tdBye);

            table.append(tr);

        } else {

            let tdDate = document.createElement("TD");
            tdDate.innerHTML = "";
            if ( match.date ) {
                tdDate.innerHTML = match.date;
                hasDates = true;
            }
            tr.append(tdDate);

            if ( compColumn ) {
                let tdCategory = document.createElement("TD");
                tdCategory.innerHTML = getMatchCategory(match.category);
                tr.append(tdCategory);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.category`);

                let tdComp = document.createElement("TD");
                if ( match.competition.edition && match.competition.round ) {
                    let compAbbr = document.createElement("ABBR");
                    compAbbr.innerHTML = match.competition[ match.competition.type ];
                    compAbbr.setAttribute("title",match.competition.edition + " " + match.competition[ match.competition.type ] + ": " + match.competition.round);
                    tdComp.append(compAbbr);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.edition`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.round`);
                } else {
                    tdComp.innerHTML = match.competition[ match.competition.type ];
                }
                tr.append(tdComp);
                table.classList.add("matches-withcomp");
            }

            let tdHome = document.createElement("TD");
            tdHome.innerHTML = window.allTeams[match.home].name;
            if ( showDiv ) {
                tdHome.innerHTML += " ("+match.homeDivision+")";
            }
            tr.append(tdHome);

            let tdScore = document.createElement("TD");
            if ( match.result ) {
                switch(match.result) {
                    case "W": tdScore.classList.add("match-iswin"); break;
                    case "D": tdScore.classList.add("match-isdraw"); break;
                    case "L": tdScore.classList.add("match-isloss"); break;
                }
            }
            if ( match.forfeit ) {
                let tdScoreFF = document.createElement("ABBR");
                tdScoreFF.title = "Match forfeited";
                tdScoreFF.innerHTML = match.score;
                tdScore.append(tdScoreFF);
            } else {
                tdScore.innerHTML = match.score;
            }
            tr.append(tdScore);

            let tdAway = document.createElement("TD");
            tdAway.innerHTML = window.allTeams[match.away].name;
            if ( showDiv ) {
                tdAway.innerHTML = "("+match.awayDivision+") " + tdAway.innerHTML;
            }
            tr.append(tdAway);

            if ( highlightWinner ) {
                const score = match.score.split("-");
                let homeScoreParsed = Number.parseInt(score[0]);
                let awayScoreParsed = Number.parseInt(score[1]);
                if ( homeScoreParsed > awayScoreParsed ) {
                    tdAway.classList.add("match-loser");
                } else if ( homeScoreParsed < awayScoreParsed ) {
                    tdHome.classList.add("match-loser");
                } else {
                    console.warn("No winner?",match);
                }
            }

            if ( isSeason ) {
                if ( season !== match.season ) {
                    console.warn("inconsistent season value",season,match.season);
                }

                if ( comp.type === "international" ) {
                    // no checks
                } else if ( comp.type === "playoff" && comp.playoff !== match.competition.playoff ) {
                    console.warn("inconsistent playoff competition",comp,match.competition.playoff);
                } else if ( comp.type === "cup" && (
                    comp.cup !== match.competition.cup
                    || comp.round !== match.competition.round
                    || comp.cup_code !== match.competition.cup_code
                    || comp.round !== match.competition.round
                    )) {
                    console.warn("inconsistent cup competition",comp.cup_code,match.competition.cup_code);
                } else if ( ! ["international","playoff","cup"].includes(comp.type)) {
                    console.warn("validate match competition data",comp,match.competition);
                }
            }

            let tdNotes = document.createElement("TD");
            tdNotes.innerHTML = "";
            if ( match.outcome ) {
                tdNotes.innerHTML = match.outcome
                    .replaceAll(match.home,window.allTeams[match.home].name)
                    .replaceAll(match.away,window.allTeams[match.away].name)
                    .replaceAll("|","<br />")
                    ;
                hasNotes = true;
            }
            if ( focusPlayer !== "" ) {
                const mePlayer = match.players.find(key => key.player === focusPlayer);
                window.dataKeySet = [...window.dataKeySet,...Object.keys(mePlayer).map(key => `ME_PLAYER.${key}`)];
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `ME_PLAYER.gk`);

                if ( mePlayer.captain ) {
                    tdNotes.innerHTML += (tdNotes.innerHTML === "" ? "" : " | " ) + "Captain";
                    hasNotes = true;
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `ME_PLAYER.captain`);
                }

                if ( mePlayer.goals ) {
                    tdNotes.innerHTML += (tdNotes.innerHTML === "" ? "" : " | " ) + "Goals ("+mePlayer.goals.length+"): " + mePlayer.goals.join("', ") + "'";
                    hasNotes = true;
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `ME_PLAYER.goals`);
                }

                window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `ME_PLAYER.player`);
                window.dataKeySet = window.dataKeySet.filter(key => key !== `ME_PLAYER.cap`);
            }
            if ( match.note ) {
                if ( tdNotes.innerHTML !== "" ) {
                    tdNotes.innerHTML += "<br />";
                }
                tdNotes.innerHTML+= match.note;
                hasNotes = true;
            }
            tr.append(tdNotes);

            table.append(tr);

            if ( hasIntData ) {

                hasNotes = true;
                tdNotes.innerHTML = match.stadium + ", " + match.location;
                if ( match.country ) {
                    tdNotes.innerHTML += " (" + allTeams[match.country].name;
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.country`);
                }

                let trTwo = document.createElement("TR");

                let tdComp = document.createElement("TD");
                tdComp.innerHTML = match.competition.international;
                if ( match.competition.edition ) {
                    tdComp.innerHTML = match.competition.edition + "<br />" + tdComp.innerHTML;
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.edition`);
                }
                if ( match.competition.round ) {
                    tdComp.innerHTML += "<br />" + match.competition.round;
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.competition.round`);
                }
                trTwo.append(tdComp);

                let tdGoalsHome = document.createElement("TD");
                let tdGoalsSpacer = document.createElement("TD");
                let tdGoalsAway = document.createElement("TD");

                match.goals.forEach(g=>{
                    window.dataKeySet = [...window.dataKeySet,...Object.keys(g).map(key => `${keyPrefix}.goals.${key}`)];

                    tdGoalsSpacer.innerHTML += g.min + "<br />";

                    let playerEntry = g.player;
                    if ( g.team === "_LUX" ) {
                        playerEntry = window.intPlayers[playerEntry].name[0][0] + " " + window.intPlayers[playerEntry].name[1];
                    }
                    if ( g.penalty ) {
                        playerEntry += " (pen)";
                    }

                    if ( g.team === match.home ) {
                        tdGoalsHome.innerHTML += playerEntry + "<br />";
                        tdGoalsAway.innerHTML += "" + "<br />";
                    } else {
                        tdGoalsAway.innerHTML += playerEntry + "<br />";
                        tdGoalsHome.innerHTML += "" + "<br />";
                    }

                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.goals.min`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.goals.team`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.goals.player`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.goals.penalty`);
                });

                trTwo.append(tdGoalsHome);
                trTwo.append(tdGoalsSpacer);
                trTwo.append(tdGoalsAway);

                let tdMatchNotes = document.createElement("TD");
                tdMatchNotes.innerHTML = "Attendance: " + Number(match.attendance).toLocaleString("en-GB");
                trTwo.append(tdMatchNotes);

                table.append(trTwo);

                let trThree = document.createElement("TR");

                let tdSquad = document.createElement("TD");
                tdSquad.colSpan = 4;
                tdSquad.innerHTML = "";
                match.players.forEach(p=>{
                    window.dataKeySet = [...window.dataKeySet,...Object.keys(p).map(key => `${keyPrefix}.players.${key}`)];
                    window.dataKeySet = [...window.dataKeySet,...Object.keys(p.cap).map(key => `${keyPrefix}.players.cap.${key}`)];

                    tdSquad.innerHTML +=
                        (tdSquad.innerHTML === "" ? "" : "; ")
                        + window.intPlayers[p.player].name[0][0]
                        + " "
                        + window.intPlayers[p.player].name[1]
                        + (p.gk ? " (GK)" : "")
                        + (p.captain ? " (C)" : "")
                    ;

                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.player`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.goals`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.cap`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.captain`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.gk`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.cap.competition`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.cap.opponent`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.cap.date`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.cap.comp_edition`);
                    window.dataKeySet = window.dataKeySet.filter(key => key !== `${keyPrefix}.players.cap.comp_round`);
                    if ( p.cap.competition !== match.competition.international ) {
                        console.warn("Inconsistent international competition",p.cap.competition,match.competition.international);
                    }
                    if (
                        (match.home === "_LUX" && p.cap.opponent !== match.away )
                        || (match.away === "_LUX" && p.cap.opponent !== match.home )
                    ) {
                        console.warn("Inconsistent international opponent",p.cap.opponent,match.home,match.away);
                    }
                    if ( p.cap.date !== match.date ) {
                        console.warn("Inconsistent international date",p.cap.date,match.date);
                    }

                });

                let tdEmpty1 = document.createElement("TD");
                tdEmpty1.innerHTML = "";
                trThree.append(tdEmpty1);
                trThree.append(tdSquad);

                table.append(trThree);
            }
        }
    });

    if ( ! hasNotes ) {
        table.classList.add("notes__none");
    }
    if ( ! hasDates ) {
        table.classList.add("dates__none");
    }

    dataContainer.append(table);
}