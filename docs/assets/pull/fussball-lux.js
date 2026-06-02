console.clear();
seasonData = {};
seasonParts = window.location.href.split("/").pop().replace("Saison","").split(".")[0].replace("-19","-").replace("-20","-").split("-");
seasonData.season = seasonParts[0] + "-" + seasonParts[1];
seasonData.next = (parseInt(seasonParts[0])+1) + "-" + (parseInt(seasonParts[1])+1);
seasonData.prev = (parseInt(seasonParts[0])-1) + "-" + (parseInt(seasonParts[1])-1);
document.querySelectorAll("table table").forEach(t=>{
    t.addEventListener("click",function(e){
        source = e.target;
        while ( source.nodeName !== "TABLE" ) {
            source = source.parentNode;
        }
        type = prompt("[R]esults or [S]tandings or [C]up?").toUpperCase();
        while ( ["R","S","C"].indexOf(type) === -1 ) {
            type = prompt("[R]esults or [S]tandings or [C]up?").toUpperCase();
        }
        if ( type === "R" ) {
            pullResults(source);
            source.remove();
        } else if ( type === "S" ) {
            pullStandings(source);
            source.remove();
        } else if ( type === "C" ) {
            pullCup(source);
            source.remove();
        }
    });
});
DIVISIONS = {
    "1": "National Division",
    "2": "Division of Honour",
    "3": "1. Division",
    "4": "2. Division",
    "5": "3. Division",
    "6": "4. Division"
};
allTeams = {
    "Alliance Dudelange": "ADUD","Avenir Flaxweiler": "AFLX","Arantia Berdorf": "ARBD","AS Remich": "AREM","Aris Bonnevoie": "ARIS","AS Schifflange": "ASCH",
    "AS Differdange": "ASDF","AS Luxembourg": "ASLX","Alisontia Steinsel": "ASTN","Atert Bissen": "ATBS","Avenir Beggen": "AVBG","Arminia Weidingen": "AWDG",
    "Blue Boys Muhlenbach": "BBML","Blo-Giel Hupperdange": "BGHP","FC Bigonville": "BGNV","The Belval Belvaux": "BLVL","US Bous": "BOUS","FC Brouch": "BRCH",
    "US Boevange/Attert": "BVAT","Blo-Wäiss Itzig": "BWIT","Blo-Wäiss Medernach": "BWMD","CS Echternach": "CECH","CS Grevenmacher": "CGRV","ES Clemency": "CLMC",
    "Claravallis Clervaux": "CLVX","CS Mondorf-les-Bains": "CMLB","CS Hollerich": "CSHL","CS Petange": "CPET","Chiers Rodange": "CROD","CS Oberkorn": "CSOB",
    "Daring Club Echternach": "DARE","Eclair Bettembourg": "ECBT","Etoile Bleu Dudelange": "EBDU","Egalité Weimerskirch": "EGWM","FC Ehlerange": "EHLR",
    "Etoile Rouge 1908 Dudelange": "ERDU","ES Schouweiler": "ESHW","Etoile Sportive Luxembourg": "ESLX","Etzella Ettelbréck": "ETZE","FC Oberkorn": "FCOB",
    "Fola Esch": "FOLA","Forta Beaufort": "FRTA","Gold a Ro't Wiltz": "GOLD","Green Star Wilwerdingen": "GSWW","FC Hamm 37": "HAMM","US Hollerich/Bonnevoie": "HLBN",
    "CS Hobscheid": "HOBS","US Hostert": "HOST","FC Hupperdange": "HUPP","Jeunesse Bettembourg": "JBET","Jeunesse Biwer": "JBIW","Jeunesse Esch": "JESH",
    "Jeunesse Gilsdorf": "JGIL","Jeunesse Heisdorf": "JHSD","Jeunesse Hautcharage": "JHTC","Jeunesse 07 Kayl": "JKYL","Jeunesse Ospern": "JOSP",
    "Jeunesse Schieren": "JSCH","Jeunesse Sportive Koerich": "JSKH","Jeunesse Steinfort": "JSTF","Jeunesse Junglinster": "JUNG","Jeunesse Useldange":
    "JUSE","Jeunesse Verlorenkost": "JVRL","Jeunesse Wasserbillig": "JWAS","Jeunesse Weimerskirch": "JWMK","Jeunesse Wilwerdingen": "JWIL","FC Kehlen": "KHLN",
    "FC Knaphoscheid/Selscheid": "KNAP","FC Kopstal 33": "KOPS","Kiischpelt Wilwerwiltz": "KPWW","Koeppchen Wormeldange": "KWRM","Les Ardoisiers Perlé": "LARD",
    "FC Lorentzweiler": "LRNZ","Luna Oberkorn": "LUNA","Mamer 32": "MAMR","Mansfeldia Clausen": "MANC","Marisca Mersch": "MARM","FC Mondercange": "MDCG",
    "US Mondorf-les-Bains": "MDLB","Les Montagnards Weiswampach": "MGWW","Minerva Lintgen": "MINL","Minière Lasauvage": "MLSV","Sporting Mertzig": "MRTZ",
    "National Schifflange": "NSCH","Old Boys Consdorf": "OBCN","Orania Vianden": "OVND","Olympia Christnach/Waldbillig": "OYCW","Olympique Äischen": "OYMP",
    "Phalanx Kleinbettingen": "PHLK","AS Pratzerthal": "PRTZ","Progrès Grund": "PROG","Progrès Niederkorn": "PRON","Racing Club Luxembourg": "RACL",
    "Red Boys Aspelt": "RBAS","Red Boys Differdange": "RBDF","Red Black Pfaffenthal": "RBPF","US Reisdorf": "REIS","Racing Heiderscheid": "RHDS",
    "Ro'de Le'w Consthum": "RLCN","CS Rollingergrund": "ROLG","Rapid Neudorf": "RPDN","Racing Rodange": "RROD","Red Star Merl": "RSML","Rupensia Larochette": "RUPL",
    "US Sandweiler": "SAND","Sporting Bertrange": "SBRT","Sporting Club Bettembourg": "SCBT","Sporting Club Luxembourg": "SCLX","SC Differdange": "SDIF",
    "Stade Dudelange": "SDUD","Saint Michel Oberpallen": "SMOB","CS Sanem": "SNEM","Spora Luxembourg": "SPOR","Sporting Steinfort": "SPST","SC Rédange": "SRED",
    "SC Tétange": "STET","Sura Esch/Sauer": "SURA","Swift Hesperange": "SWFT","Syra Mensdorf": "SYRA","Titus Lamadelaine": "TLMD","Tricolore Gasperich": "TRIG",
    "Tricolore Muhlenweg": "TRIM","Racing Troisvierges": "TSVG","US Bascharage": "UBSH","US Esch": "UESH","US Feulen": "UFLN","Union Luxembourg": "ULUX",
    "US Mertert": "UMRT","US Rumelange": "URUM","US Dudelange": "USDD","US Moutfort/Medingen": "USMM","US Niederwiltz": "USND","Victoria Rosport": "VICR",
    "Résidence Walferdange": "WALF","FC Wiltz 71": "WLTZ","FC Weiswampach": "WWMP","Young Boys Diekirch": "YBDK","Yellow Boys Weiler-la-Tour": "YBWT",
    "Red Star Merl/Belair":"RSMB","AS Hosingen":"AHOS","AS Colmar-Berg":"ASCB","Les Aiglons Dalheim":"LADH","FC Erpeldange 72":"ERPL","Jeunesse Canach":"JCNC",
    "FC Munsbach":"MUNS","CS Bourscheid":"CBSH","FC Harlange":"HARL","Tarwat Tarchamps":"TWTC","GB Harlange/Tarchamps":"GBHT","UNA Strassen":"UNAS",
    "Vinesca Ehnen":"VINE","FC Beyren-Udinesina":"BYUD","Yougo Grund-Cessange":"YGGC","Progrès Cessange":"PROC","Berdenia Berbourg": "BDBB",
    "Amis de la Moselle Remerschen":"AMRS","FC Noertzange HF":"NORZ","US Folschette":"FOLS","AS Wincrange":"WINC","FC 47 Bastendorf":"BAST","Excelsior Grevels":"EXGV",
    "SC Ell":"SELL","Iska Boys Simmern":"ISKA","RM 86 Luxembourg":"RMLX","Racing Heiderscheid/Eschdorf":"RHSE","US Rambrouch":"RAMB","Sporting Beckerich":"SBCK",
    "FC Rodange 91": "RODG", "F91 Dudelange": "F91D","Etzella Ettelbruck": "ETZE","The National Schifflange":"NSCH", "Union Mertert/Wasserbillig":"UNMW",
    "Schifflange 95":"SCHF", "UN Käerjéng 97":"KAER","Rupensia Lusitanos Larochette":"RPLL","FC Differdange 03":"DIFF","Blo-Weiss Medernach":"BWMD",
    "Union 05 Kayl/Tétange": "U5KT","FF Norden 02":"NORD","Alliance Aischdall H/E":"AAHE","Union Remich/Bous":"UNRB","Racing Union":"RACE","RM Hamm Benfica":"BENF",
    "Red Boys Differdingen": "RBDF","Union Luxemburg":"ULUX", "Spora Luxemburg":"SPOR","Stade Düdelingen":"SDUD","The National Schifflingen":"NSCH",
    "Alliance Düdelingen":"ADUD", "F 91 Düdelingen": "F91D", "FC Monnerich": "MDCG", "Aris Bonneweg": "ARIS", "CS Petingen": "CPET", "US Rümelingen": "URUM",
    "US Düdelingen": "USDD", "Etzella Ettelbrück": "ETZE", "US Hollerich/Bonneweg": "HLBN", "Sporting Club Luxemburg": "SCLX", "Racing Club Luxemburg": "RACL",
    "FC Differdingen 03": "DIFF", "FC RM Hamm Benfica": "RMHM", "RFCU Luxemburg": "RACE", "Swift Hesperingen": "SWFT", "AS Luxemburg": "ASLX", "AS Schifflingen": "ASCH",
    "Olympique Eischen": "OYMP", "Etoile Sportive Schouweiler": "ESHW", "Etoile Sportive Clemency": "CLMC", "Blo-Weiss Itzig": "BWIT", "Cessange FC": "CESS",
    "K. Wormeldange": "KWRM", "Remich/Bous": "UNRB", "U. Kayl/Tétange": "U5KT", "Mertert/Wasserb.": "UNMW", "Rés. Walferdange": "WALF", "Red Black/Egalité": "RBE7",
    "FC Schengen": "SHGN", "RS Merl/Belair": "RSMB", "FC Red Black/Egalité 07": "RBE7", "Sporting Schouweiler": "ESHW", "AS Differdingen": "ASDF",
    "Diables Rouges Zolver": "DRZV", "Una Strassen": "UNAS","FC Mamer 32": "MAMR", "Kischpelt Wilwerwiltz": "KPWW", "Rac. Heiderscheid/Eschdorf": "RHSE",
    "FC Pratzerthal/Redange": "FCPR", "SC Differdingen": "SDIF", "FC Cebra 01": "CBRA", "FC Flaxweiler/Beyren": "FBU1", "Les Amis de la Moselle Remerschen": "AMRS",
    "FC 72 Erpeldingen": "ERPL", "Blue-Boys Muhlenbach": "BBML", "US Berdorf/Consdorf": "USBC", "FC Schifflingen 95": "SCHF", "Alliance 01 Luxemburg": "ALLX",
    "RM 86 Luxemburg": "RMLX", "SC Bettembourg": "SCBT", "Titus Petingen": "UNTP", "Vistoria Rosport": "VICR", "US Mondorf": "MDLB", "FC Luxemburg City": "LUXC",
    "FC Koeppchen": "KOEP", "Rupensia Lusit. Larochette": "RPLL", "R. Heiderscheid/Eschdorf": "RHSE", "Ol. Christnach/Waldbillig": "OYCW", "FC Biekerech": "BIEK",
    "Pratzerthal/Rédange": "FCPR", "JS Koerich": "KOSM", "Union Mertert/Wasser.": "UNMW", "Flaxweiler/Beyren": "FBU1", "Green Boys Harlange/Tarchamps": "GBHT",
    "AS Luxemburg/Porto": "ASLX", "FC Koerich": "KOSM","FC Stengefort":"STNG","AS Colmar/Berg":"ASCB","Jeunesse Junglinstert":"JUNG","Union Titus Petingen":"UNTP",
    "FC Beyren": "BYUD", "US Eschdorf": "UEDF", "Mansfeldia Clausen-Cents": "MANC","Sporting Club Steinfort":"SPST","Young Boys Schweicherthal":"YBSW",
    "Black Boys Bascharage": "BBOY", "FC Obercorn": "FCOB","Jeunesse Sportive Sanem":"JSNM", "US Hagen": "HAGN", "Young Boys Zolver": "YBSL",
    "The International Esch": "IESH", "Enfants de la Source Mondorf": "ENFM", "Jeunesse Monnerich":"JMON","Jeunesse Mondercange":"JMON","US Merl":"MERL",
    "Stade Mosellan Grevenmacher":"SGRV","Union Beckerich":"UBEK","Alzetta Cruchten":"ALCR","FC Käerch":"KOSM","Alliance Aischdall Hobscheid/Eischen":"AAHE",
    "Daring Echternach":"DARE","FC Red Black Pfaffenthal":"RBPF","Racing FC Union Luxemburg":"RACE","Ro'de Le'w Niederdonven":"RLND","CS Greiveldange":"GRIV",
    "Fortuna Canach":"FCNC","Jeunesse Flaxweiler":"JFLX","US Dahl":"DAHL","Jeunesse Goesdorf":"JGOS","Sura Michelau":"SURM","Blue Boys Erpeldingen/Ettelbrück":"BBEE",
    "Le Monflin Bigonville":"MONF","FC Everlange":"EVER","FC Ell":"FELL","Koeppchen Wormeldingen":"KWRM","Blue Star Schweicherthal":"BSSW","Jeunesse Useldingen":"JUSE",
    "Sporting Bellain":"SBEL","FC Hoscheid":"HOSC","FC Doncols":"DONC","US Graulinster":"GRAU","Jeunesse Sportive Hagen":"JHAG", "Armnia Weidingen":"AWDG"
}
function pullResults(tbl) {
    season = seasonData.season;
    level = prompt("League level");
    comp = prompt("Competition",DIVISIONS[level]?DIVISIONS[level]:"");
    level = parseInt(level);
    rows = tbl.querySelectorAll("tr");
    teams = [];
    output = [];
    for ( r=1 ; r!==rows.length ; r++ ) {
        cols = rows[r].querySelectorAll("td");
        theTeam = cols[0].textContent.trim();

        checkTeamName = theTeam;
        teamCode = "";

        if ( checkTeamName.endsWith(" II") ) {
            checkTeamName = checkTeamName.replace(" II","");
        }
        if ( ! allTeams[checkTeamName] ) {
            allTeams[checkTeamName] = prompt("Unknown team",checkTeamName).toUpperCase();
        }
        if ( ! theTeam.endsWith(" II") && ! theTeam.endsWith(" III") ) {
            teams.push( allTeams[checkTeamName] );
        } else if ( theTeam.endsWith(" II") ) {
            teams.push( allTeams[checkTeamName] + ":2" );
        } else if ( theTeam.endsWith(" III") ) {
            teams.push( allTeams[checkTeamName] + ":3" );
        }
    }

    for ( r=1 ; r!==rows.length ; r++ ) {
        cols = rows[r].querySelectorAll("td");
        for ( c=1 ; c!==cols.length ; c++ ) {
            if ( teams[r-1] !== teams[c-1] ) {
                score = cols[c].textContent.trim().replace("- ","-");
                output.push({"home":teams[r-1],"away":teams[c-1],"score":score,"season":season,"competition":{"type":"league","level":level,"league":comp}});
            }
        }
    }
    teams.sort();
    if ( ! seasonData.league ) {
        seasonData.league = [];
    }
    if ( seasonData.league.length < level ) {
        console.error("Need the league table first");
    } else {
        seasonData.league[(level-1)].matches = output;
        console.log(seasonData);
    }
}
function pullStandings(tbl) {
    season = seasonData.season;
    level = prompt("League level");
    comp = prompt("Competition",DIVISIONS[level]?DIVISIONS[level]:"");
    level = parseInt(level);
    series = parseInt(prompt("Series?"));
    if ( isNaN(series) ) {
        series = -1;
    }
    ppw = parseInt(prompt("Points per win",2));
    champion = "";
    if ( level === 1 ) {
        champion = prompt("Champion code").toUpperCase();
    }
    relegated = prompt("Relegated codes").toUpperCase();
    promoted = prompt("Promoted codes").toUpperCase();
    rows = tbl.querySelectorAll("tr");
    teams = [];
    output = [];

    for ( r=1 ; r!==rows.length ; r++ ) {
        cols = rows[r].querySelectorAll("td");
        if ( cols.length !== 1 ) {
            teamName = cols[1].textContent.trim().replace("&nbsp;"," ").replace(" "," ").replace(" (P)","").replace(" (N)","").replace(" (M)","").replace(" (A)","").trim();
            checkTeamName = teamName;
            teamCode = "";

            if ( teamName.endsWith(" II") ) {
                checkTeamName = checkTeamName.replace(" II","");
            }
            if ( ! allTeams[checkTeamName] ) {
                allTeams[checkTeamName] = prompt("Unknown team",checkTeamName).toUpperCase();
            }
            if ( ! teamName.endsWith(" II") ) {
                teams.push( allTeams[checkTeamName] );
            } else {
                teams.push( allTeams[checkTeamName] + ":2" );
            }

            teamCode = allTeams[checkTeamName];
            if ( teamName.endsWith(" II") ) {
                teamCode += ":2";
            }

            isChamp = teamCode === champion;
            isRelegated = relegated.indexOf(teamCode) !== -1;
            isPromoted = promoted.indexOf(teamCode) !== -1;

            thisRow = {
                "place": readNumber(cols[0]),
                "team": teamCode,
                "w": readNumber(cols[4]),
                "d": readNumber(cols[5]),
                "l": readNumber(cols[6]),
                "f": readNumber(cols[10]),
                "a": readNumber(cols[12]),
                "season": season,
                "competition": {
                    "type": "league",
                    "level": level,
                    "league":comp
                }
            };
            if ( series !== -1 ) {
                thisRow.competition.series = series;
                thisRow.competition.type = "league_series";
            }
            if ( ppw !== 3 ) {
                thisRow.pts_win = ppw;
            }
            if ( isChamp ) {
                thisRow.champion = true;
            }
            if ( isRelegated ) {
                thisRow.relegated = true;
            }
            if ( isPromoted ) {
                thisRow.promoted = true;
            }

            output.push(thisRow);
        }
    }

    teams.sort();
    if ( ! seasonData.league ) {
        seasonData.league = [];
    }
    if ( series === -1 ) {
        thisLeague = {
            name: comp,
            standings: output,
            level: level
        };
        if ( ppw !== 3 ) {
            thisLeague.pts_win = ppw;
        }
        seasonData.league.push(thisLeague);
    } else {
        thisSeries = {
            serie: series,
            name: prompt("Series short name",comp),
            standings: output
        }
        if ( ppw !== 3 ) {
            thisSeries.pts_win = ppw;
        }
        if ( ! seasonData.league[level-1] ) {
            thisLeague = {
                name: prompt("League wrapper name",comp),
                level: level,
                series: []
            };
            if ( ppw !== 3 ) {
                thisLeague.pts_win = ppw;
            }
            seasonData.league[level-1] = thisLeague;
        }
        seasonData.league[level-1].series.push(thisSeries);
    }
    console.log(seasonData);
}
function readNumber(i) {
    return parseInt(i.textContent.trim());
}
function pullCup(tbl) {
    theTable = tbl;

    divisions = {};
    thisRound = "";
    thisRoundCode = "";
    roundIndex = 0;
    rounds = [];
    season = seasonData.season;
    thisRoundLines = [];
    whichCup = prompt("Which cup? flf / luxembourg");
    whichCupName = prompt("Name of cup " + whichCup,
        (whichCup === "flf" ? "Coupe FLF" : (
            whichCup === "luxembourg" ? "Luxembourg Cup" : whichCup
        ))
    );

    theTable.querySelectorAll("tr").forEach(row=>{
        cols = row.querySelectorAll("td");
        if ( cols.length === 1 ) {
            // new round
            txt = cols[0].innerText.trim();
            if ( txt === "" || txt.startsWith("Aufstellung ") || txt.startsWith("Erklärung") ) {
                thisRound = "";
                // padding row
            } else if ( txt.startsWith("1 Runde ") ) {
                thisRound = "1st Round";
                thisRoundCode = "R1";
                roundIndex++;
            } else if ( txt.startsWith("2 Runde ") ) {
                thisRound = "2nd Round";
                thisRoundCode = "R2";
                roundIndex++;
            } else if ( txt.startsWith("3 Runde ") ) {
                thisRound = "3rd Round";
                thisRoundCode = "R3";
                roundIndex++;
            } else if ( txt.startsWith("4 Runde ") ) {
                thisRound = "4th Round";
                thisRoundCode = "R4";
                roundIndex++;
            } else if ( txt.startsWith("Achtelfinale ") ) {
                thisRound = "Round of 16";
                thisRoundCode = "R16";
                roundIndex++;
            } else if ( txt.startsWith("Viertelfinale ") ) {
                thisRound = "Quarter Final";
                thisRoundCode = "QF";
                roundIndex++;
            } else if ( txt.startsWith("Halbfinale ") ) {
                thisRound = "Semi Final";
                thisRoundCode = "SF";
                roundIndex++;
            } else if ( txt.startsWith("Endspiel ") ) {
                thisRound = "Final";
                thisRoundCode = "F";
                roundIndex++;
            } else if ( txt.startsWith("Zwischenrunde ") ) {
                thisRound = "Intermediate Round";
                thisRoundCode = "INT";
                roundIndex++;
            } else if ( txt.startsWith("Freilos:") ) {
                thisRound = "BYE";
                byes = txt.replace("Freilos: ","").split(",");
                byes.forEach(b=>{
                    c = getCupClub(b.trim());
                    rounds[roundIndex-1].matches.push({
                        "bye": c[0],
                        "byeDivision": c[2].split(":")[0]
                    });
                });
            } else if ( txt.startsWith("Anmerkung:") ) {
                // team withdrew
                thisRound = "";
            } else {
                thisRound = cols[0].innerText;
            }
            if ( thisRound !== "" && thisRound !== "BYE" ) {
                rounds.push({});
                rounds[roundIndex-1].name = thisRound,
                rounds[roundIndex-1].matches = [];
            }
        } else {
            // match
            home = getCupClub(cols[0].innerText.trim());
            away = getCupClub(cols[2].innerText.trim());
            score = cols[3].innerText.trim().replaceAll("- ","-");

            extraBits = "";

            wasReplayed = false;

            scoreParts = score.replaceAll("- ","-");
            scoreParts = scoreParts.split(" ");
            if ( scoreParts.length === 1 ) {
                scoreBit = {score:scoreParts[0]};
            } else if ( scoreParts.length === 2 && scoreParts[0] === "3-0" && scoreParts[1] === "ff." ) {
                scoreBit = {score:scoreParts[0],forfeit:true};
            } else if ( scoreParts.length === 2 && scoreParts[0] === "0-3" && scoreParts[1] === "ff." ) {
                scoreBit = {score:scoreParts[0],forfeit:true};
            } else if ( scoreParts.length === 2 && scoreParts[0] === "5-0" && scoreParts[1] === "ff." ) {
                scoreBit = {score:scoreParts[0],forfeit:true};
            } else if ( scoreParts.length === 2 && scoreParts[0] === "0-5" && scoreParts[1] === "ff." ) {
                scoreBit = {score:scoreParts[0],forfeit:true};
            } else if ( scoreParts.length === 2 && scoreParts[1] === "n.V." ) {
                scoreBit = {score:scoreParts[0],aet:true};
            } else if ( scoreParts.length === 5 && scoreParts[1] === "n.V." && scoreParts[4] === "n.E." ) {
                scoreBit = {score:scoreParts[0],aet:true,penalties:scoreParts[3]};
            } else if ( score.indexOf(" / ") !== -1 ) {
                wasReplayed = true;
                firstScore = score.split(" / ")[0];
                secondScore = score.split(" / ")[1];

                FIRSTscoreParts = firstScore.replaceAll("- ","-");
                FIRSTscoreParts = FIRSTscoreParts.split(" ");
                if ( FIRSTscoreParts.length === 1 ) {
                    FIRSTscoreBit = {score:FIRSTscoreParts[0]};
                } else if ( FIRSTscoreParts.length === 2 && FIRSTscoreParts[0] === "3-0" && FIRSTscoreParts[1] === "ff." ) {
                    FIRSTscoreBit = {score:FIRSTscoreParts[0],forfeit:true};
                } else if ( FIRSTscoreParts.length === 2 && FIRSTscoreParts[0] === "0-3" && FIRSTscoreParts[1] === "ff." ) {
                    FIRSTscoreBit = {score:FIRSTscoreParts[0],forfeit:true};
                } else if ( FIRSTscoreParts.length === 2 && FIRSTscoreParts[0] === "5-0" && FIRSTscoreParts[1] === "ff." ) {
                    FIRSTscoreBit = {score:FIRSTscoreParts[0],forfeit:true};
                } else if ( FIRSTscoreParts.length === 2 && FIRSTscoreParts[0] === "0-5" && FIRSTscoreParts[1] === "ff." ) {
                    FIRSTscoreBit = {score:FIRSTscoreParts[0],forfeit:true};
                } else if ( FIRSTscoreParts.length === 2 && FIRSTscoreParts[1] === "n.V." ) {
                    FIRSTscoreBit = {score:FIRSTscoreParts[0],aet:true};
                } else if ( FIRSTscoreParts.length === 5 && FIRSTscoreParts[1] === "n.V." && FIRSTscoreParts[4] === "n.E." ) {
                    FIRSTscoreBit = {score:FIRSTscoreParts[0],aet:true,penalties:FIRSTscoreParts[3]};
                } else {
                    FIRSTscoreBit = {score:"UNKNOWN"};
                }

                SECONDscoreParts = secondScore.replaceAll("- ","-");
                SECONDscoreParts = SECONDscoreParts.split(" ");
                if ( SECONDscoreParts.length === 1 ) {
                    SECONDscoreBit = {score:SECONDscoreParts[0]};
                } else if ( SECONDscoreParts.length === 2 && SECONDscoreParts[0] === "3-0" && SECONDscoreParts[1] === "ff." ) {
                    SECONDscoreBit = {score:SECONDscoreParts[0],forfeit:true};
                } else if ( SECONDscoreParts.length === 2 && SECONDscoreParts[0] === "0-3" && SECONDscoreParts[1] === "ff." ) {
                    SECONDscoreBit = {score:SECONDscoreParts[0],forfeit:true};
                } else if ( SECONDscoreParts.length === 2 && SECONDscoreParts[0] === "5-0" && SECONDscoreParts[1] === "ff." ) {
                    SECONDscoreBit = {score:SECONDscoreParts[0],forfeit:true};
                } else if ( SECONDscoreParts.length === 2 && SECONDscoreParts[0] === "0-5" && SECONDscoreParts[1] === "ff." ) {
                    SECONDscoreBit = {score:SECONDscoreParts[0],forfeit:true};
                } else if ( SECONDscoreParts.length === 2 && SECONDscoreParts[1] === "n.V." ) {
                    SECONDscoreBit = {score:SECONDscoreParts[0],aet:true};
                } else if ( SECONDscoreParts.length === 5 && SECONDscoreParts[1] === "n.V." && SECONDscoreParts[4] === "n.E." ) {
                    SECONDscoreBit = {score:SECONDscoreParts[0],aet:true,penalties:SECONDscoreParts[3]};
                } else {
                    SECONDscoreBit = {score:"UNKNOWN"};
                }

            } else {
                console.error("unknown score",score);
                scoreBit = JSON.stringify( {score:"UNKNOWN"} );
            }

            if ( ! wasReplayed ) {
                match = {
                    season: season,
                    competition: {
                        type: "cup",
                        cup_code: whichCup,
                        cup: whichCupName,
                        round: thisRound,
                        round_code: thisRoundCode
                    },
                    home: home[0],
                    homeDivision: home[2].split(":")[0],
                    away: away[0],
                    awayDivision: away[2].split(":")[0]
                };
                match = Object.assign(match,scoreBit);

                rounds[roundIndex-1].matches.push(match);
            } else {
                match = {
                    season: season,
                    competition: {
                        type: "cup",
                        cup_code: whichCup,
                        cup: whichCupName,
                        round: thisRound,
                        round_code: thisRoundCode
                    },
                    home: home[0],
                    homeDivision: home[2].split(":")[0],
                    away: away[0],
                    awayDivision: away[2].split(":")[0]
                };
                match = Object.assign(match,FIRSTscoreBit);
                match.replay = SECONDscoreBit;

                rounds[roundIndex-1].matches.push(match);
            }
        }
    });

    if ( ! seasonData.cup ) {
        seasonData.cup = {};
    }
    seasonData.cup[whichCup] = {
        name: whichCupName,
        rounds: rounds
    };
    console.log(seasonData);
}
function getCupClub(c) {
    c = c.replace("&nbsp;"," ");
    c = c.replace(" "," ");
    club = c.split(" (")[0];
    if ( c.split(" (").length > 1 ) {
        division = c.split(" (")[1].replace(")","");
    } else {
        console.error("Unknown Club/Division",c);
        club = c;
    }
    if ( ! divisions[division] ) {
        divisions[division] = prompt("LEVEL for Division: '"+division+"'") + ":" + division;
    }
    if ( allTeams[club] ) {
        club = allTeams[club];
    } else {
        console.error("Unknown club",club);
    }
    return [club,division,divisions[division]];
}
console.log("ready and waiting...");

function toString() {
    console.clear();
    console.warn(JSON.stringify(seasonData));
    output = '{\n';
    output += '\t"season": "'+seasonData.season+'",\n';
    output += '\t"next": "'+seasonData.next+'",\n';
    output += '\t"prev": "'+seasonData.prev+'"';
    if ( seasonData.league ) {
        output += ',\n';
        output += '\t"league": [';
        seasonData.league.forEach(l=>{
            output += ',{\n';
            output += '\t\t"level": '+l.level+',\n';
            output += '\t\t"name": "'+l.name+'",\n';
            if ( l.pts_win ) {
                output += '\t\t"pts_win": '+l.pts_win+'';
            }
            if ( l.standings ) {
                output += ',\n\t\t"standings": [\n';
                l.standings.forEach((s,idx)=>{
                    output += '\t\t\t{';
                    output += '"place": '+s.place;
                    output += ', "team": "'+s.team+'"';
                    output += ', "w": '+s.w;
                    output += ', "d": '+s.d;
                    output += ', "l": '+s.l;
                    output += ', "f": '+s.f;
                    output += ', "a": '+s.a;
                    if ( s.pts_win ) {
                        output += ', "pts_win": '+s.pts_win;
                    }
                    output += ', "season": "'+s.season+'"';
                    output += ', "competition": {';
                    output += ' "type": "'+s.competition.type+'"';
                    output += ', "level": '+s.competition.level;
                    output += ', "league": "'+s.competition.league+'"';
                    if ( s.competition.series ) {
                        output += ', "series": '+s.competition.series;
                    }
                    output += ' }';
                    if ( s.champion ) {
                        output += ', "champion": true';
                    }
                    if ( s.promoted ) {
                        output += ', "promoted": true';
                    }
                    if ( s.relegated ) {
                        output += ', "relegated": true';
                    }
                    output += '}';
                    if ( (idx+1) !== l.standings.length ) {
                        output += ',';
                    }
                    output += '\n';
                });
                output += '\t\t]';
            }
            if ( l.matches ) {
                output += ',\n\t\t"matches": [\n';
                l.matches.forEach((m,idx)=>{
                    output += '\t\t\t{';
                    output += ' "home": "'+m.home+'"';
                    output += ', "away": "'+m.away+'"';
                    output += ', "score": "'+m.score+'"';
                    output += ', "season": "'+m.season+'"';
                    output += ', "competition": {';
                    output += ' "type": "'+m.competition.type+'"';
                    output += ', "level": '+m.competition.level;
                    output += ', "league": "'+m.competition.league+'"';
                    output += '}';
                    output += ' }';
                    if ( (idx+1) !== l.matches.length ) {
                        output += ',';
                    }
                    output += '\n';
                });
                output += '\t\t]';
            }
            if ( l.series ) {
                output += ',\n\t\t"series": [';
                l.series.forEach((s,idx)=>{
                    output += ',{\n';
                    output += '\t\t\t"serie": '+s.serie;
                    output += ',\n\t\t\t"name": "'+s.name+'"';
                    if ( s.pts_win ) {
                        output += ',\n\t\t\t"pts_win": '+s.pts_win;
                    }
                    if ( s.standings ) {
                        output += ',\n\t\t\t"standings": [\n';
                        s.standings.forEach((ss,sidx)=>{
                            output += '\t\t\t\t{';
                            output += '"place": '+ss.place;
                            output += ', "team": "'+ss.team+'"';
                            output += ', "w": '+ss.w;
                            output += ', "d": '+ss.d;
                            output += ', "l": '+ss.l;
                            output += ', "f": '+ss.f;
                            output += ', "a": '+ss.a;
                            if ( ss.pts_win ) {
                                output += ', "pts_win": '+ss.pts_win;
                            }
                            output += ', "season": "'+ss.season+'"';
                            output += ', "competition": {';
                            output += ' "type": "'+ss.competition.type+'"';
                            output += ', "level": '+ss.competition.level;
                            if ( ss.competition.series ) {
                                output += ', "series": '+ss.competition.series;
                            }
                            output += ', "league": "'+ss.competition.league+'"';
                            output += ' }';
                            if ( ss.champion ) {
                                output += ', "champion": true';
                            }
                            if ( ss.promoted ) {
                                output += ', "promoted": true';
                            }
                            if ( ss.relegated ) {
                                output += ', "relegated": true';
                            }
                            output += '}';
                            if ( (sidx+1) !== s.standings.length ) {
                                output += ',';
                            }
                            output += '\n';
                        });
                        output += '\t\t\t]';
                    }
                    output += '\n\t\t}';
                });
                output += ']';
            }
            output += '\n\t}';
        });
        output += ']';
    }
    if ( seasonData.cup ) {
        output += ',\n';
        output += '\t"cup": {\n';
        if ( seasonData.cup.luxembourg ) {
            output += '\t\t"luxembourg": {\n';
            output += '\t\t\t"name": "'+seasonData.cup.luxembourg.name+'",\n';
            output += '\t\t\t"rounds": [';
            seasonData.cup.luxembourg.rounds.forEach((r,idx)=>{
                output += '{\n';
                output += '\t\t\t\t"name": "'+r.name+'",\n';
                output += '\t\t\t\t"matches": [\n';
                r.matches.forEach((m,midx)=>{
                    output += '\t\t\t\t\t{';
                    output += '"season": "'+m.season+'"';
                    output += ', "competition": {';
                    output += '"type": "'+m.competition.type+'"';
                    output += ', "cup_code": "'+m.competition.cup_code+'"';
                    output += ', "cup": "'+m.competition.cup+'"';
                    output += ', "round_code": "'+m.competition.round_code+'"';
                    output += ', "round": "'+m.competition.round+'"';
                    output += '}';
                    output += ', "home": "'+m.home+'"';
                    output += ', "homeDivision": '+m.homeDivision;
                    output += ', "away": "'+m.away+'"';
                    output += ', "awayDivision": '+m.awayDivision;
                    output += ', "score": "'+m.score+'"';
                    if ( m.forfeit ) {
                        output += ', "forfeit": true';
                    }
                    if ( m.replay ) {
                        output += ', "replay": {"score": "'+m.replay.score+'"}';
                    }
                    output += '}';
                    if ( (midx+1) !== r.matches.length ) {
                        output += ',';
                    }
                    output += '\n';
                });
                output += '\t\t\t\t]\n';
                output += '\t\t\t}';
                if ( (idx+1) !== seasonData.cup.luxembourg.rounds.length ) {
                    output += ',';
                }
            });
            output += ']\n';
            output += '\t\t}\n';
        }
        output += '\t}';
    }
    output += '\n}';
    output = output.replaceAll("[,{","[{");
    console.log(output);
}