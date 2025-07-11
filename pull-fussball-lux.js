console.clear();
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
    "Sporting Bellain":"SBEL","FC Hoscheid":"HOSC","FC Doncols":"DONC","US Graulinster":"GRAU"
}
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
        } else if ( type === "S" ) {
            pullStandings(source);
        } else if ( type === "C" ) {
            pullCup(source);
        }
    });
});
function pullResults(tbl) {
    season = window.location.href.split("/").pop().split(".")[0].replace("-19","-").replace("-20","-").replace("Saison","");
    level = parseInt(prompt("League level"));
    comp = prompt("Competition");
    rows = tbl.querySelectorAll("tr");
    teams = [];
    output = [];
    for ( r=1 ; r!==rows.length ; r++ ) {
        cols = rows[r].querySelectorAll("td");
        theTeam = cols[0].textContent.trim();
        if ( theTeam.indexOf(" II") !== -1 ) {
            theTeam = theTeam.replace(" II","");
        }

        checkTeamName = theTeam;
        teamCode = "";

        if ( checkTeamName.endsWith(" II") ) {
            checkTeamName = checkTeamName.replace(" II","");
        }
        if ( ! allTeams[checkTeamName] ) {
            allTeams[checkTeamName] = prompt("Unknown team",checkTeamName);
        }
        if ( ! theTeam.endsWith(" II") ) {
            teams.push( allTeams[checkTeamName] );
        } else {
            teams.push( allTeams[checkTeamName] + ":2" );
        }
    }

    for ( r=1 ; r!==rows.length ; r++ ) {
        cols = rows[r].querySelectorAll("td");
        for ( c=1 ; c!==cols.length ; c++ ) {
            if ( teams[r-1] !== teams[c-1] ) {
                score = cols[c].textContent.trim().replace("- ","-");
                output.push('{"home":"'+teams[r-1]+'","away":"'+teams[c-1]+'","score":"'+score+'","season":"'+season+'","competition":{"type":"league","level": '+level+',"name": "'+comp+'"}},');
            }
        }
    }
    teams.sort();
    console.log('"'+teams.join('","')+'"');
    console.log(output.join("\n\t\t"));
}
function pullStandings(tbl) {
    season = window.location.href.split("/").pop().split(".")[0].replace("-19","-").replace("-20","-").replace("Saison","");
    level = parseInt(prompt("League level"));
    comp = prompt("Competition");
    ppw = parseInt(prompt("Points per win",3));
    champion = prompt("Champion code");
    relegated = prompt("Relegated codes");
    if ( relegated !== "" ) {
        relegated = relegated.split(",");
        nextSeasonDown = prompt("Next season",season);
        relegateToLevel = parseInt(prompt("Relegate to which level?",level+1));
        relegateToName = prompt("Relegate to which division?");
    }
    promoted = prompt("Promoted codes");
    if ( promoted !== "" ) {
        promoted = promoted.split(",");
        nextSeasonUp = prompt("Next season",season);
        promoteToLevel = parseInt(prompt("Promote to which level?",level-1));
        promoteToName = prompt("Promote to which division?");
    }
    if ( ppw === 3 ) {
        ppw = "";
    } else {
        ppw = ', "pts_win": '+ppw;
    }
    rows = tbl.querySelectorAll("tr");
    teams = [];
    output = [];

    for ( r=1 ; r!==rows.length ; r++ ) {
        cols = rows[r].querySelectorAll("td");
        if ( cols.length !== 1 ) {
            teamName = cols[1].textContent.trim().replace(" (P)","").replace(" (N)","").replace(" (M)","").replace(" (A)","");
            checkTeamName = teamName;
            teamCode = "";

            if ( teamName.endsWith(" II") ) {
                checkTeamName = checkTeamName.replace(" II","");
            }
            if ( ! allTeams[checkTeamName] ) {
                allTeams[checkTeamName] = prompt("Unknown team",checkTeamName);
            }
            if ( ! teamName.endsWith(" II") ) {
                teams.push( allTeams[checkTeamName] );
            } else {
                teams.push( allTeams[checkTeamName] + ":2" );
            }

            champ = "";
            if ( allTeams[teamName] === champion ) {
                champ = ', "champion": true, "title_count": ' + parseInt(prompt("Title count for "+allTeams[teamName]));
            }
            rele = "";
            if ( relegated.indexOf(allTeams[teamName]) !== -1 ) {
                rele = ', "relegated": true, "target": {"season": "'+nextSeasonDown+'", "level": '+relegateToLevel+', "name": "'+relegateToName+'"}';
            }
            if ( promoted.indexOf(allTeams[teamName]) !== -1 ) {
                rele = ', "promoted": true, "target": {"season": "'+nextSeasonUp+'", "level": '+promoteToLevel+', "name": "'+promoteToName+'"}';
            }
            
            output.push('{"place": '+readNumber(cols[0])+', "team": "'+allTeams[teamName] +'", "w": '+readNumber(cols[4])+', "d": '+readNumber(cols[5])+', "l": '+readNumber(cols[6])+', "f": '+readNumber(cols[10])+', "a": '+readNumber(cols[12])+ppw+', "season": "'+season+'", "level": '+level+', "league": "'+comp+'"'+champ+rele+'},');
        }
    }
    
    teams.sort();
    console.log('"'+teams.join('","')+'"');
    console.log(output.join("\n\t\t"));
}
function readNumber(i) {
    return parseInt(i.textContent.trim());
}
theTable = null;
function pullCup(tbl) {
    theTable = tbl;

    divisions = {};
    thisRound = "";
    thisRoundLines = [];
    season = window.location.href.split("/").pop().split(".")[0].replace("Saison","").replace("-19","-").replace("-20","-");
    whichCup = prompt("Which cup? cup_flf / cup_luxembourg");
    whichCupName = prompt("Name of cup " + whichCup,whichCup);

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
            } else if ( txt.startsWith("2 Runde ") ) {
                thisRound = "2nd Round";
            } else if ( txt.startsWith("3 Runde ") ) {
                thisRound = "3rd Round";
            } else if ( txt.startsWith("Viertelfinale ") ) {
                thisRound = "Quarter Final";
            } else if ( txt.startsWith("Halbfinale ") ) {
                thisRound = "Semi Final";
            } else if ( txt.startsWith("Endspiel ") ) {
                thisRound = "Final";
            } else if ( txt.startsWith("Zwischenrunde ") ) {
                thisRound = "Intermediate Round";
            } else if ( txt.startsWith("Freilos:") ) {
                thisRound = "";
                byes = txt.replace("Freilos: ","").split(",");
                byes.forEach(b=>{
                    c = getCupClub(b.trim());
                    thisRoundLines.push('\t\t\t{"bye":"'+c[0]+'", "byeDivision": {"level":'+c[2].split(":")[0]+',"name":"'+c[2].split(":")[1]+'"}},\n');
                });
            } else {
                thisRound = cols[0].innerText;
            }
            if ( thisRound !== "" ) {
                thisRoundLines.push('\t\t"name": "'+thisRound+'",\n\t\t"matches":[\n');
            }
        } else {
            // match
            home = getCupClub(cols[0].innerText.trim());
            away = getCupClub(cols[2].innerText.trim());
            score = cols[3].innerText.trim().replaceAll("- ","-");
    
            extraBits = "";

            scoreParts = score.replaceAll("- ","-");
            scoreParts = scoreParts.split(" ");
            if ( scoreParts.length === 1 ) {
                scoreBit = JSON.stringify( {score:scoreParts[0]} );
            } else if ( scoreParts.length === 2 && scoreParts[0] === "3-0" && scoreParts[1] === "ff." ) {
                scoreBit = JSON.stringify( {score:scoreParts[0],forfeit:true} );
            } else if ( scoreParts.length === 2 && scoreParts[1] === "n.V." ) {
                scoreBit = JSON.stringify( {score:scoreParts[0],aet:true} );
            } else if ( scoreParts.length === 5 && scoreParts[1] === "n.V." && scoreParts[4] === "n.E." ) {
                scoreBit = JSON.stringify( {score:scoreParts[0],aet:true,penalties:scoreParts[3]} );
            } else {
                console.error(score);
                scoreBit = JSON.stringify( {score:"UNKNOWN"} );
            }
            scoreBit = scoreBit.replace("{","").replace("}","");
            
            thisRoundLines.push('\t\t\t{"season": "'+season+'","competition": {"type":"cup","cup":"'+whichCup+'","name":"'+whichCupName+'","round":"'+thisRound+'"},"home": "'+home[0]+'", "homeDivision": {"level":'+home[2].split(":")[0]+',"name":"'+home[2].split(":")[1]+'"},"away": "'+away[0]+'", "awayDivision": {"level":'+away[2].split(":")[0]+',"name":"'+away[2].split(":")[1]+'"},'+scoreBit+'},\n');
        }
    });
    console.log(thisRoundLines.join(""));
}
function getCupClub(c) {
    club = c.split(" (")[0];
    division = c.split(" (")[1].replace(")","");
    if ( ! divisions[division] ) {
        divisionName = prompt("DIVISION '"+division+"'")
        divisions[division] = prompt("LEVEL '"+divisionName+"'") + ":" + divisionName;
    }
    if ( allTeams[club] ) {
        club = allTeams[club];
    } else {
        console.error("Unknown club",club);
    }
    return [club,division,divisions[division]];
}