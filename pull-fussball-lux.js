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
    "Vinesca Ehnen":"VINE","FC Beyren-Udinesina":"BYUD","Yougo Grund-Cessange":"YGCC","Progrès Cessange":"PROC","Berdenia Berbourg": "BDBB",
    "Amis de la Moselle Remerschen":"AMRS","FC Noertzange HF":"NORZ","US Folschette":"FOLS","AS Wincrange":"WINC","FC 47 Bastendorf":"BAST","Excelsior Grevels":"EXGV",
    "SC Ell":"SELL","Iska Boys Simmern":"ISKA","RM 86 Luxembourg":"RMLX","Racing Heiderscheid/Eschdorf":"RHSE","US Rambrouch":"RAMB","Sporting Beckerich":"SBCK",
    "FC Rodange 91": "RODG", "F91 Dudelange": "F91D","Etzella Ettelbruck": "ETZE","The National Schifflange":"NSCH", "Union Mertert/Wasserbillig":"UNMW",
    "Schifflange 95":"SCHF", "UN Käerjéng 97":"KAER","Rupensia Lusitanos Larochette":"RPLL","FC Differdange 03":"DIFF","Blo-Weiss Medernach":"BWMD",
    "Union 05 Kayl/Tétange": "U5KT","FF Norden 02":"NORD","Alliance Aischdall H/E":"AAHE","Union Remich/Bous":"UNRB","Racing Union":"RACE","RM Hamm Benfica":"BENF",
    "Red Boys Differdingen": "RBDF","Union Luxemburg":"ULUX", "Spora Luxemburg":"SPOR","Stade Düdelingen":"SDUD","The National Schifflingen":"NSCH",
    "Alliance Düdelingen":"ADUD"
}
document.querySelectorAll("table table").forEach(t=>{
    t.addEventListener("click",function(e){
        source = e.target;
        while ( source.nodeName !== "TABLE" ) {
            source = source.parentNode;
        }
        type = prompt("[R]esults or [S]tandings?").toUpperCase();
        while ( ["R","S"].indexOf(type) === -1 ) {
            type = prompt("[R]esults or [S]tandings?").toUpperCase();
        }
        if ( type === "R" ) {
            pullResults(source);
        } else if ( type === "S" ) {
            pullStandings(source);
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
        if ( allTeams[cols[0].textContent.trim()] ) {
            teams.push( allTeams[cols[0].textContent.trim()] );
        } else {
            teams.push( prompt("Unknown team",cols[0].textContent.trim()) );
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
    level = parseInt(prompt("League level",1));
    comp = prompt("Competition","Honour Division");
    ppw = parseInt(prompt("Points per win",3));
    champion = prompt("Champion code");
    relegated = prompt("Relegated codes").split(",");
    if ( relegated.length !== 0 ) {
        nextSeason = prompt("Next season",season);
        relegateToLevel = parseInt(prompt("Relegate to which level?",level+1));
        relegateToName = prompt("Relegate to which division?");
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
            teamName = cols[1].textContent.trim().replace(" (P)","").replace(" (N)","").replace(" (M)","");
            
            if ( allTeams[teamName] ) {
                teams.push( allTeams[teamName] );
            } else {
                allTeams[teamName] = prompt("Unknown team",teamName);
                teams.push( allTeams[teamName] );
            }

            champ = "";
            if ( allTeams[teamName] === champion ) {
                champ = ', "champion": true, "title_count": ' + parseInt(prompt("Title count for "+allTeams[teamName]));
            }
            rele = "";
            if ( relegated.indexOf(allTeams[teamName]) !== -1 ) {
                rele = ', "relegated": true, "target": {"season": "'+nextSeason+'", "level": '+relegateToLevel+', "name": "'+relegateToName+'"}';
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