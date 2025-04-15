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
    "Schifflange 95":"SCHF", "UN Käerjéng 97":"KAER","Rupensia Lusitanos Larochette":"RPLL","FC Differdange 03":"DIFF","Blo-Weiss Medernach":"BWMD"
}
champs = JSON.parse(localStorage.champs);
obj = {
    season: window.location.href.split("/").pop().split(".")[0].replace("Saison","").replace("-19","-").replace("-20","-"),
    leagues: {},
    cups: {}
};
function getTeam(team) {
    if ( team.indexOf(" II") !== -1 ) {
        team = team.replace(" II","");
        if ( ! allTeams[team] ) {
            console.error("Unknown team",team);
            allTeams[team] = prompt("Give me a new code please",team);
        }
        return allTeams[team] + ":2";
    } else {
        if ( ! allTeams[team] ) {
            console.error("Unknown team",team);
            allTeams[team] = prompt("Give me a new code please",team);
        }
        return allTeams[team];
    }
}
function addLevel(level,name,winner){
    winner = getTeam(winner);
    if ( ! winner ) { winner = "XXXX"; }
    obj.leagues["level_"+level] = {
        missing: true,
        season: obj.season,
        level: level,
        name: name,
        winner: winner
    }
    if ( level === 1 && winner ) {
        if ( champs[winner] ) {
            if ( champs[winner].league ) {
                champs[winner].league++;
            } else {
                champs[winner].league = 1;
            }
        } else {
            champs[winner] = {league:1};
        }
        obj.leagues["level_"+level].title_count = champs[winner].league;
        localStorage.champs = JSON.stringify(champs);
    }
}
function addSeries(level,series,name,winner){
    winner = getTeam(winner);
    if ( ! winner ) { winner = "XXXX"; }
    if ( ! obj.leagues["level_"+level] ) {
        obj.leagues["level_"+level] = {
            season: obj.season,
            level: level,
            name: prompt("General name",name.replace(" Series 1","")),
            series: []
        }
    }
    obj.leagues["level_"+level].series.push({
        missing: true,
        season: obj.season,
        level: level,
        series: series,
        name: name,
        winner: winner
    });
}
function addCup(winner,level,series){
    winner = getTeam(winner);
    if ( ! winner ) { winner = "XXXX"; }
    obj.cups.cup_luxembourg = {
        missing: true,
        season: obj.season,
        name: "Luxembourg Cup",
        winner: winner
    };
    if ( winner ) {
        if ( champs[winner] ) {
            if ( champs[winner].cup ) {
                champs[winner].cup++;
            } else {
                champs[winner].cup = 1;
            }
        } else {
            champs[winner] = {cup:1};
        }
        obj.cups.cup_luxembourg.title_count = champs[winner].cup;
        localStorage.champs = JSON.stringify(champs);
    }
    if ( series ) {
		obj.cups.cup_luxembourg.winner_division = {
        	level: level,
        	series: series,
        	name: obj.leagues["level_"+level].series[series-1].name
        }
    } else {
		obj.cups.cup_luxembourg.winner_division = {
        	level: level,
        	name: obj.leagues["level_"+level].name
        }
    }
}
function addFlf(winner,level,series){
    winner = getTeam(winner);
    if ( ! winner ) { winner = "XXXX"; }
    obj.cups.cup_flf = {
        missing: true,
        season: obj.season,
        name: "Coupe FLF",
        winner: winner
    };
    if ( winner ) {
        if ( champs[winner] ) {
            if ( champs[winner].flf ) {
                champs[winner].flf++;
            } else {
                champs[winner].flf = 1;
            }
        } else {
            champs[winner] = {flf:1};
        }
        obj.cups.cup_flf.title_count = champs[winner].flf;
        localStorage.champs = JSON.stringify(champs);
    }
    if ( series ) {
		obj.cups.cup_flf.winner_division = {
        	level: level,
        	series: series,
        	name: obj.leagues["level_"+level].series[series-1].name
        }
    } else {
		obj.cups.cup_flf.winner_division = {
        	level: level,
        	name: obj.leagues["level_"+level].name
        }
    }
}
function draw() {
    console.clear();
    if ( obj.leagues.level_1.winner === obj.cups.cup_luxembourg.winner ) {
    	obj.leagues.level_1.double = true;
    	obj.cups.cup_luxembourg.double = true;
    }
	output = JSON.stringify(obj);
	output = output.replace("{","{\n\t\t");
	output = output.replace(',"leagues":{',',\n\t\t"leagues": {\n');
	["level_1","level_2","level_3","level_4","level_5","level_6","cup_luxembourg","cup_flf"].forEach(s=>{
	    output = output.replace('"'+s+'":{','\t\t\t"'+s+'":{');
	    output = output.replace(',\t\t\t"'+s+'":{',',\n\t\t\t"'+s+'":{');
	});
	["season","name","level","winner","title_count","winner_division","double"].forEach(s=>{
	    output = output.replaceAll('"'+s+'":',' "'+s+'": ');
	});
	output = output.replaceAll(':[{',':[\n\t\t\t\t{');
	output = output.replaceAll('},{','},\n\t\t\t\t{');
	output = output.replaceAll('}]},','}\n\t\t\t]},');
	output = output.replace('}]}},"cups":{','}\n\t\t\t]}\n\t\t},\n\t\t"cups": {\n');
	output = output.replace('}},"cups":{','}\n\t\t\t]}\n\t\t},\n\t\t"cups": {\n');
	output = output.replaceAll('":{','": {');
	output = output.replace(' "season":','"season":');
	output = output.replace("}}}","}\n\t\t}\n\t}");
	console.log(output);
}
function level(level,winner) {
	if ( level === 1 ) {
		addLevel(1,'National Division',winner);
	} else if ( level === 2 ) {
		addLevel(2,'Division of Honour',winner);
    } else if ( level === 5 ) {
        addLevel(5,'3. Division',winner);
	} else {
		console.error("What to do?");
	}
}
function series(level,winners) {
	if ( level === 2 ) {
		for ( w=0 ; w!==winners.length ; w++ ) {
			addSeries(level,w+1,"Division of Honour Series "+(w+1),winners[w]);
		}
    } else if ( level === 3 ) {
		for ( w=0 ; w!==winners.length ; w++ ) {
			addSeries(level,w+1,"1. Division Series "+(w+1),winners[w]);
		}
	} else if ( level === 4 ) {
		for ( w=0 ; w!==winners.length ; w++ ) {
			addSeries(level,w+1,"2. Division Series "+(w+1),winners[w]);
		}
	} else if ( level === 5 ) {
		for ( w=0 ; w!==winners.length ; w++ ) {
			addSeries(level,w+1,"3. Division Series "+(w+1),winners[w]);
		}
	} else if ( level === 6 ) {
		for ( w=0 ; w!==winners.length ; w++ ) {
			addSeries(level,w+1,"4. Division Series "+(w+1),winners[w]);
		}
	} else {
		console.error("What to do?");
	}
}
function league(nationalDivision,divisionHonour,division1,division2,division3) {
    one = nationalDivision;
    two = divisionHonour;
    thr = division1;
    fou = division2;
    fiv = division3;
    if ( Array.isArray(one) ) { series(1,one); } else { level(1,one); }
    if ( Array.isArray(two) ) { series(2,two); } else { level(2,two); }
    if ( Array.isArray(thr) ) { series(3,thr); } else { level(3,thr); }
    if ( Array.isArray(fou) ) { series(4,fou); } else { level(4,fou); }
    if ( Array.isArray(fiv) ) { series(5,fiv); } else { level(5,fiv); }
}