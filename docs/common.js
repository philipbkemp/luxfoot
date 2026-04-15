clubsPos = [];

function getClubsPipe() {
    pipe = [];
    clubsPos.forEach(cp=>{
        if ( cp ) {
            pipe.push('"'+cp.join("|")+'"');
        }
    });
    return "["+pipe.join(",")+"]";
}

function drawStandingsTable(standings,keyPrefix,compType,compLevel,compName,compSeries=0,isSeason=true) {
    dataContainer = document.getElementById("dataContainer");

    playoffsNeeded = [];

    table = document.createElement("TABLE");
    table.classList.add("standings");

    thead = document.createElement("THEAD");
    trHead = document.createElement("TR");
    
    if ( ! isSeason ) {
        thSeason = document.createElement("TH");
        thSeason.innerHTML = "Season";
        trHead.append(thSeason);
        table.classList.add("standings-history");
    }
    
    thPlace = document.createElement("TH");
    thPlace.innerHTML = "#";
    trHead.append(thPlace);
    if ( ! isSeason ) {
        thPlace.innerHTML = "Level / #";
        thPlace.setAttribute("colspan",6);
    }
    
    thTeam = document.createElement("TH");
    thTeam.innerHTML = "Team";
    trHead.append(thTeam);
    cols = ["P","W","D","L","F","A","Pts","GD"];
    colsAbbr = ["Played","Won","Drawn","Lost","For","Against","Points","Goal difference"];
    for ( i=0 ; i!==cols.length ; i++ ) {
        thCol = document.createElement("TH");
        thCol.innerHTML = "<abbr title='"+colsAbbr[i]+"'>"+cols[i]+"</abbr>";
        trHead.append(thCol);
    }
    thNotes = document.createElement("TH");
    thNotes.innerHTML = "Notes";
    trHead.append(thNotes);
    thead.append(trHead);
    table.append(thead);

    hasNotes = false;

    totalWins = 0;
    totalDraws = 0;
    totalLosses = 0;
    totalFor = 0;
    totalAgainst = 0;

    tbody = document.createElement("TBODY");
    standings.forEach((standing,index)=>{
        keys = [...keys,...Object.keys(standing).map(key => `${keyPrefix}.${key}`)];
        keys = keys.filter(key => key !== `${keyPrefix}.place`);
        keys = keys.filter(key => key !== `${keyPrefix}.team`);
        keys = keys.filter(key => key !== `${keyPrefix}.missing`);
        keys = keys.filter(key => key !== `${keyPrefix}.season`);
        keys = keys.filter(key => key !== `${keyPrefix}.playoff`);
        keys = keys.filter(key => key !== `${keyPrefix}.champion`);
        keys = keys.filter(key => key !== `${keyPrefix}.w`);
        keys = keys.filter(key => key !== `${keyPrefix}.d`);
        keys = keys.filter(key => key !== `${keyPrefix}.l`);
        keys = keys.filter(key => key !== `${keyPrefix}.f`);
        keys = keys.filter(key => key !== `${keyPrefix}.a`);
        keys = keys.filter(key => key !== `${keyPrefix}.pts_win`);
        keys = keys.filter(key => key !== `${keyPrefix}.relegated`);
        keys = keys.filter(key => key !== `${keyPrefix}.promoted`);
        keys = keys.filter(key => key !== `${keyPrefix}.removed`);
        keys = keys.filter(key => key !== `${keyPrefix}.note`);

        if ( standing.competition ) {
            keys = [...keys,...Object.keys(standing.competition).map(key => `${keyPrefix}.competition.${key}`)];
            keys = keys.filter(key => key !== `${keyPrefix}.competition`);
            if ( standing.competition.type === "league" || standing.competition.type === "league_series" ) {
                keys = keys.filter(key => key !== `${keyPrefix}.competition.type`);
                keys = keys.filter(key => key !== `${keyPrefix}.competition.level`);
                keys = keys.filter(key => key !== `${keyPrefix}.competition.league`);
            }
            if ( standing.competition.type === "league_series" ) {
                keys = keys.filter(key => key !== `${keyPrefix}.competition.series`);
            }
        }

        tr = document.createElement("TR");

        if ( ! standing.gap ) {
            
            if ( ! isSeason ) {
                tdSeason = document.createElement("TD");
                tdSeason.innerHTML = standing.season;
                tr.append(tdSeason);
            }

            if ( isSeason ) {
                tdPlace = document.createElement("TD");
                tdPlace.innerHTML = standing.place;
                tr.append(tdPlace);
                if ( ! clubsPos[standing.place] ) {
                    clubsPos[standing.place] = [];
                }
                clubsPos[standing.place].push(standing.team);
            } else {
                for ( i=1 ; i!==7 ; i++ ) {
                    tdPlace = document.createElement("TD");
                    if ( standing.competition.level === i ) {
                        tdPlace.innerHTML = standing.place;
                    }
                    tr.append(tdPlace);
                }
            }

            tdTeam = document.createElement("TD");
            if ( isSeason ) {
                tdTeam.innerHTML = allTeams[standing.team].name;
            } else {
                tdTeam.innerHTML = standing.competition.league;
            }
            tr.append(tdTeam);

            if ( ! standing.missing ) {

                tdP = document.createElement("TD");
                tdP.innerHTML = standing.w + standing.d + standing.l;
                tr.append(tdP);

                tdW = document.createElement("TD");
                tdW.innerHTML = standing.w;
                tr.append(tdW);

                tdD = document.createElement("TD");
                tdD.innerHTML = standing.d;
                tr.append(tdD);

                tdL = document.createElement("TD");
                tdL.innerHTML = standing.l;
                tr.append(tdL);

                tdF = document.createElement("TD");
                tdF.innerHTML = standing.f;
                tr.append(tdF);

                tdA = document.createElement("TD");
                tdA.innerHTML = standing.a;
                tr.append(tdA);

                tdPts = document.createElement("TD");
                tdPts.innerHTML = (standing.w*(standing.pts_win?standing.pts_win:3))+standing.d;
                tr.append(tdPts);

                tdGd = document.createElement("TD");
                tdGd.innerHTML = standing.f - standing.a;
                tr.append(tdGd);

                totalWins += standing.w;
                totalDraws += standing.d;
                totalLosses += standing.l;
                totalFor += standing.f;
                totalAgainst += standing.a;

            } else {
                tdMissing = document.createElement("TD");
                tdMissing.innerHTML = "no data";
                tdMissing.colSpan = cols.length;
                tr.append(tdMissing);
            }

            tdNotes = document.createElement("TD");
            tdNotes.innerHTML = "";
            if ( isSeason && standing.playoff ) {
                tdNotes.innerHTML += (tdNotes.innerHTML !== "" ? " | " : "") + "-> " + getPlayoffName(standing.playoff);
                playoffsNeeded.push(standing.playoff);
                standing.playoff.split("|").forEach(poclass=>{
                    tr.classList.add("to-playoff--"+poclass);
                });
                hasNotes = true;
            }
            tr.append(tdNotes);

            if ( standing.champion ) {
                tr.classList.add("is-champion");
                tdNotes.innerHTML += (tdNotes.innerHTML !== "" ? " | " : "") + "Champion";
                hasNotes = true;
            }

            if ( standing.relegated ) {
                tr.classList.add("is-relegated");
                tdNotes.innerHTML += (tdNotes.innerHTML !== "" ? " | " : "") + "Relegated";
                hasNotes = true;
            }
            if ( standing.promoted ) {
                tr.classList.add("is-promoted");
                tdNotes.innerHTML += (tdNotes.innerHTML !== "" ? " | " : "") + "Promoted";
                hasNotes = true;
            }
            if ( standing.removed ) {
                tr.classList.add("is-removed");
                tdNotes.innerHTML += (tdNotes.innerHTML !== "" ? " | " : "") + "Removed";
                hasNotes = true;
            }
            
            
            if ( standing.note ) {
                tdNotes.innerHTML += (tdNotes.innerHTML !== "" ? " | " : "") + standing.note;
                hasNotes = true;
            }

            if ( isSeason ) {
                if ( (index+1) !== standing.place ) {
                    console.warn("inconsistent place value",index,standing.place);
                }
                
                if ( season !== standing.season ) {
                    console.warn("inconsistent season value",season,standing.season);
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
        } else {
            gapTd = document.createElement("TD");
            gapTd.setAttribute("colspan",20);
            gapTd.classList.add("gap-year");
            tr.append(gapTd);
            keys = keys.filter(key => key !== `${keyPrefix}.gap`);
        }

        tbody.append(tr);
    });
    table.append(tbody);

    if ( ! hasNotes ) {
        table.classList.add("notes__none");
    } else {
        table.classList.add("notes__some");
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
    poName = po;

    switch (po) {
        case "promotion_2":
        case "promotion_3":
            poName = "Promotion playoff";
            break;

        case "title":
            poName = "Title decider";
            break;
        
        case "title_playoff":
            poName = "Title playoff";
            break;

        default:
            if ( po.indexOf("|") !== -1 ) {
                return getPlayoffName(po.split("|")[0]);
            } else {
                console.warn("Unsupported playoff",po);
            }
    }

    return poName;
}

function getMatchCategory(cat) {
    switch ( cat ) {
        case "M": return "Men"; break;
    }
    return cat;
}

function drawMatches(matches,keyPrefix,comp,hasIntData=false,isSeason=true,compColumn=false,focusPlayer="") {
    dataContainer = document.getElementById("dataContainer");

    table = document.createElement("TABLE");
    table.classList.add("matches");
    if ( hasIntData ) {
        table.classList.add("matches--extradata");
    }

    hasDates = false;
    hasNotes = false;

    matches.forEach(match=>{
        keys = [...keys,...Object.keys(match).map(key => `${keyPrefix}.${key}`)];
        keys = keys.filter(key => key !== `${keyPrefix}.date`);
        keys = keys.filter(key => key !== `${keyPrefix}.home`);
        keys = keys.filter(key => key !== `${keyPrefix}.away`);
        keys = keys.filter(key => key !== `${keyPrefix}.score`);
        keys = keys.filter(key => key !== `${keyPrefix}.season`);
        keys = keys.filter(key => key !== `${keyPrefix}.outcome`);
        keys = keys.filter(key => key !== `${keyPrefix}.forfeit`);
        keys = keys.filter(key => key !== `${keyPrefix}.result`);

        if ( hasIntData ) {
            keys = keys.filter(key => key !== `${keyPrefix}.goals`);
            keys = keys.filter(key => key !== `${keyPrefix}.stadium`);
            keys = keys.filter(key => key !== `${keyPrefix}.location`);
            keys = keys.filter(key => key !== `${keyPrefix}.attendance`);
        }

        if ( match.competition ) {
            keys = [...keys,...Object.keys(match.competition).map(key => `${keyPrefix}.competition.${key}`)];
            keys = keys.filter(key => key !== `${keyPrefix}.competition`);
            if ( match.competition.type === "playoff" ) {
                keys = keys.filter(key => key !== `${keyPrefix}.competition.type`);
                keys = keys.filter(key => key !== `${keyPrefix}.competition.playoff`);
            } else if ( match.competition.type === "international" ) {
                keys = keys.filter(key => key !== `${keyPrefix}.competition.type`);
                keys = keys.filter(key => key !== `${keyPrefix}.competition.international`);
            }
        }

        tr = document.createElement("TR");

        tdDate = document.createElement("TD");
        tdDate.innerHTML = "";
        if ( match.date ) {
            tdDate.innerHTML = match.date;
            hasDates = true;
        }
        tr.append(tdDate);
        
        if ( compColumn ) {
            tdCategory = document.createElement("TD");
            tdCategory.innerHTML = getMatchCategory(match.category);
            tr.append(tdCategory);            
            keys = keys.filter(key => key !== `${keyPrefix}.category`);
            tdComp = document.createElement("TD");
            tdComp.innerHTML = match.competition[ match.competition.type ];
            tr.append(tdComp);
            table.classList.add("matches-withcomp");
        }

        tdHome = document.createElement("TD");
        tdHome.innerHTML = allTeams[match.home].name;
        tr.append(tdHome);

        tdScore = document.createElement("TD");
        if ( match.result ) {
            switch(match.result) {
                case "W": tdScore.classList.add("match-iswin"); break;
                case "D": tdScore.classList.add("match-isdraw"); break;
                case "L": tdScore.classList.add("match-isloss"); break;
            }
        }
        if ( match.forfeit ) {
            tdScoreFF = document.createElement("ABBR");
            tdScoreFF.title = "Match forfeited";
            tdScoreFF.innerHTML = match.score;
            tdScore.append(tdScoreFF);
        } else {
            tdScore.innerHTML = match.score;
        }
        tr.append(tdScore);

        tdAway = document.createElement("TD");
        tdAway.innerHTML = allTeams[match.away].name;
        tr.append(tdAway);

        if ( isSeason ) {
            if ( season !== match.season ) {
                console.warn("inconsistent season value",season,match.season);
            }

            if ( comp.type === "international" ) {
                // no checks
            } else if ( comp.type === "playoff" && comp.playoff !== match.competition.playoff ) {
                console.warn("inconsistent playoff competition",comp,match.competition.playoff);
            } else if ( ! ["international","playoff"].includes(comp.type)) {
                console.warn("validate match competition data",comp,match.competition);
            }
        }

        tdNotes = document.createElement("TD");
        tdNotes.innerHTML = "";
        if ( match.outcome ) {
            tdNotes.innerHTML = match.outcome
                .replaceAll(match.home,allTeams[match.home].name)
                .replaceAll(match.away,allTeams[match.away].name)
                ;
            hasNotes = true;
        }
        if ( focusPlayer !== "" ) {
            mePlayer = match.players.filter(key => key.player === focusPlayer)[0];
            keys = [...keys,...Object.keys(mePlayer).map(key => `ME_PLAYER.${key}`)];
                keys = keys.filter(key => key !== `ME_PLAYER.gk`);
            
            if ( mePlayer.captain ) {
                tdNotes.innerHTML += (tdNotes.innerHTML !== "" ? " | " : "" ) + "Captain";
                hasNotes = true;
                keys = keys.filter(key => key !== `ME_PLAYER.captain`);
            }
            
            if ( mePlayer.goals ) {
                tdNotes.innerHTML += (tdNotes.innerHTML !== "" ? " | " : "" ) + "Goals ("+mePlayer.goals.length+"): " + mePlayer.goals.join("', ") + "'";
                hasNotes = true;
                keys = keys.filter(key => key !== `ME_PLAYER.goals`);
            }
            
            keys = keys.filter(key => key !== `${keyPrefix}.players`);
            keys = keys.filter(key => key !== `ME_PLAYER.player`);
            keys = keys.filter(key => key !== `ME_PLAYER.cap`);
        }
        tr.append(tdNotes);

        table.append(tr);

        if ( hasIntData ) {

            hasNotes = true;
            tdNotes.innerHTML = match.stadium + ", " + match.location;

            trTwo = document.createElement("TR");

            tdComp = document.createElement("TD");
            tdComp.innerHTML = match.competition.international;
            trTwo.append(tdComp);

            tdGoalsHome = document.createElement("TD");
            tdGoalsSpacer = document.createElement("TD");
            tdGoalsAway = document.createElement("TD");
            
            match.goals.forEach(g=>{
                keys = [...keys,...Object.keys(g).map(key => `${keyPrefix}.goals.${key}`)];

                tdGoalsSpacer.innerHTML += g.min + "<br />";

                playerEntry = g.player;
                if ( g.team === "_LUX" ) {
                    playerEntry = intPlayers[playerEntry].name[0][0] + " " + intPlayers[playerEntry].name[1];
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

                keys = keys.filter(key => key !== `${keyPrefix}.goals.min`);
                keys = keys.filter(key => key !== `${keyPrefix}.goals.team`);
                keys = keys.filter(key => key !== `${keyPrefix}.goals.player`);
                keys = keys.filter(key => key !== `${keyPrefix}.goals.penalty`);
            });

            trTwo.append(tdGoalsHome);
            trTwo.append(tdGoalsSpacer);
            trTwo.append(tdGoalsAway);

            tdMatchNotes = document.createElement("TD");
            tdMatchNotes.innerHTML = "Attendance: " + match.attendance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
            trTwo.append(tdMatchNotes);

            table.append(trTwo);

            trThree = document.createElement("TR");

            tdSquad = document.createElement("TD");
            tdSquad.colSpan = 4;
            tdSquad.innerHTML = "";
            match.players.forEach(p=>{
                keys = [...keys,...Object.keys(p).map(key => `${keyPrefix}.players.${key}`)];
                keys = [...keys,...Object.keys(p.cap).map(key => `${keyPrefix}.players.cap.${key}`)];

                tdSquad.innerHTML +=
                    (tdSquad.innerHTML === "" ? "" : "; ")
                    + intPlayers[p.player].name[0][0]
                    + " "
                    + intPlayers[p.player].name[1]
                    + (p.gk ? " (GK)" : "")
                    + (p.captain ? " (C)" : "")
                ;

                keys = keys.filter(key => key !== `${keyPrefix}.players.player`);
                keys = keys.filter(key => key !== `${keyPrefix}.players.goals`);
                keys = keys.filter(key => key !== `${keyPrefix}.players.cap`);
                keys = keys.filter(key => key !== `${keyPrefix}.players.captain`);
                keys = keys.filter(key => key !== `${keyPrefix}.players.gk`);
                keys = keys.filter(key => key !== `${keyPrefix}.players`);
                keys = keys.filter(key => key !== `${keyPrefix}.players.cap.competition`);
                keys = keys.filter(key => key !== `${keyPrefix}.players.cap.opponent`);
                keys = keys.filter(key => key !== `${keyPrefix}.players.cap.date`);
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

            tdEmpty1 = document.createElement("TD");
            tdEmpty1.innerHTML = "";
            trThree.append(tdEmpty1);
            trThree.append(tdSquad);

            table.append(trThree);
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