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