$(document).ready(function(){

	if ( checkParams(["season"]) ) {
	
		$.ajax({
			url: "data/seasons.json",
			success: function(data) {
				parseSeasons(data);
			}
		})

	}

});

seasonToShow = {};
function parseSeasons(data) {
	toShow = data.filter(s=>{return s.season === urlParams.season;});
	if ( toShow.length !== 1 ) {
		invalid();
		return;
	}

	showIndex = data.indexOf(toShow[0]);

	prevSeason = data[showIndex-1];
	nextSeason = data[showIndex+1];
	if ( nextSeason ) {
		$("#seasonLinkNext").attr("href","season.html?season="+nextSeason.season).removeClass("d-none");
	}
	if ( prevSeason ) {
		$("#seasonLinkPrev").attr("href","season.html?season="+prevSeason.season).removeClass("d-none");
	}

	seasonToShow = toShow[0];

	$.ajax({
		url: "data/teams.json",
		success: function(data) {
			parseTeams(data);
		}
	})
}

function doneParsingTeams() {
	season = seasonToShow;
	keys = Object.keys(season);
	
	console.log(season);
	setTitles(season.season);
    keys.splice(keys.indexOf("season"),1);

	if ( season.leagues ) {
		subKeys = Object.keys(season.leagues);
		for ( i=0 ; i!==subKeys.length ; i++ ) {
			subKeys[i] = "leagues." + subKeys[i];
		}
		keys = [...keys,...subKeys];
		keys.splice(keys.indexOf("leagues"),1);
		if ( season.leagues.level_1 ) {
			subKeys = Object.keys(season.leagues.level_1);
			for ( i=0 ; i!==subKeys.length ; i++ ) {
				subKeys[i] = "leagues.level_1." + subKeys[i];
			}
			keys = [...keys,...subKeys];
			displayWinner(season.leagues.level_1);
		}
		leagueComp = $("<DIV></DIV>").addClass("col-2");
		leagueCompList = $("<DIV></DIV>").addClass("list-group");
		leagueCompHead = $("<DIV></DIV>").addClass("list-group-item list-group-item-primary").html("Leagues");
		leagueCompList.append(leagueCompHead);
		["level_1","level_2","level_3","level_4","level_5","level_6"].forEach(lvl=>{
			if ( season.leagues[lvl] ) {
				thisLevel = $("<A></A>").addClass("list-group-item").attr("href","league.html?level="+lvl.split("_").pop()).html(season.leagues[lvl].name);
				leagueCompList.append(thisLevel);
			}
		});
		leagueComp.append(leagueCompList);
		$("#competitions").append(leagueComp);
	}
	
	if ( season.cups ) {
		subKeys = Object.keys(season.cups);
		for ( i=0 ; i!==subKeys.length ; i++ ) {
			subKeys[i] = "cups." + subKeys[i];
		}
		keys = [...keys,...subKeys];
		keys.splice(keys.indexOf("cups"),1);
		subKeys.forEach(k=>{
			kClean = k.replace("cups.","");
			subSubKeys = Object.keys(season.cups[kClean]);
			for ( i=0 ; i!==subSubKeys.length ; i++ ) {
				subSubKeys[i] = k + "." + subSubKeys[i];
			}
			keys = [...keys,...subSubKeys];
			keys.splice(keys.indexOf(k),1);
			displayWinner(season.cups[kClean]);
		});
	}
	
	if ( season.europe ) {
		subKeys = Object.keys(season.europe);
		for ( i=0 ; i!==subKeys.length ; i++ ) {
			subKeys[i] = "europe." + subKeys[i];
		}
		keys = [...keys,...subKeys];
		keys.splice(keys.indexOf("europe"),1);
		subKeys.forEach(k=>{
			kClean = k.replace("europe.","");
			subSubKeys = Object.keys(season.europe[kClean]);
			for ( i=0 ; i!==subSubKeys.length ; i++ ) {
				subSubKeys[i] = k + "." + subSubKeys[i];
			}
			keys = [...keys,...subSubKeys];
			keys.splice(keys.indexOf(k),1);
		});
	}

	if ( keys.length !== 0 ) {
		console.log(keys);
	}

	$(".displayAfterLoad").removeClass("d-none");

	/*
	
	if ( season.leagues ) {
		keys = keys + "|leagues." + Object.keys(season.leagues).join("|leagues.");
		keys = keys.replace("|leagues","");

		if ( season.leagues.level_1 ) {
			showLeagueLevel(season.leagues.level_1,"leagues.level_1");
		}
		if ( season.leagues.level_2 ) {
			showLeagueLevel(season.leagues.level_2,"leagues.level_2");
		}
		if ( season.leagues.level_3 ) {
			showLeagueLevel(season.leagues.level_3,"leagues.level_3");
		}
		if ( season.leagues.level_4 ) {
			showLeagueLevel(season.leagues.level_4,"leagues.level_4");
		}
		if ( season.leagues.level_5 ) {
			showLeagueLevel(season.leagues.level_5,"leagues.level_5");
		}
	}

	if ( season.note ) {
		note = $("<DIV></DIV>").addClass("list-group-item");
		noteRow = $("<DIV></DIV>").addClass("row");
		noteColNote = $("<DIV></DIV>").addClass("col-12").html(season.note).addClass("fst-italic").addClass("py-1");
		noteRow.append(noteColNote);
		note.append(noteRow);
		keys = keys.replace("|note","");
		$("#competitions").append(note);
	}

	if ( keys.length !== 0 ) {
		console.warn(keys);
		console.log(season);
	}

	$(".placeholder-glow").hide();
	$("#competitions").removeClass("d-none");
	*/
}

function displayWinner(competition) {
	col = $("<DIV></DIV>").addClass("col-3 mb-2");
	wrap = $("<DIV></DIV>").addClass("winner-box");
	comp = $("<DIV></DIV>").addClass("winner-box__competition").html(competition.name);
	team = $("<DIV></DIV>").addClass("winner-box__team").html( allTeams[competition.winner] );
	nmbr = $("<DIV></DIV>").addClass("winner-box__count").html( getTitleCount(competition.title_count) );

	wrap.append(comp).append(team).append(nmbr);
	col.append(wrap);

	$("#winners").append(col);
}
/*
function showLeagueLevel(data,level,isSeries=false) {
	prefix = "|" + level + ".";

	if ( data.series && ! isSeries ) {
		data.series.forEach(serie=>{
			showLeagueLevel(serie,level+":"+serie.series,true);
		});
		keys = keys.replace(prefix + "series","");
		keys = keys.replace("|"+level,"");
		return;
	}

	keys = keys + prefix + Object.keys(data).join(prefix);
	keys = keys.replace(prefix + "season","");
	keys = keys.replace(prefix + "level","");

	levelOne = $("<DIV></DIV>").addClass("list-group-item");
	levelOneRow = $("<DIV></DIV>").addClass("row");
	levelOneColLevel = $("<DIV></DIV>").addClass("col-3")

	if ( ! data.missing ) {
		link = "league.html?season="+data.season+"&level="+data.level;
		if ( isSeries ) {
			link += "&series=" + data.series;
			keys = keys.replace(prefix + "series","");
		}
		levelOneLink = $("<A></A>").attr("href",link).html(data.name).addClass("d-block").addClass("p-1");
		levelOneColLevel.append(levelOneLink);
	} else {
		levelOneColLevel.html("<span class='p-1 d-block'>"+data.name+"</a>");
		keys = keys.replace(prefix + "missing","");
	}
	keys = keys.replace(prefix + "name","");

	levelOneColWinner = $("<DIV></DIV>").addClass("col-3").addClass("p-1").html(allTeams[data.winner]);
	keys = keys.replace(prefix + "winner","");
	levelOneNotes = $("<DIV></DIV>").addClass("col-6").addClass("p-1");

	if ( data.title_count ) {
		levelWinnerCount = $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").html(getTitleCount(data.title_count));
		levelOneNotes.append(levelWinnerCount);
		keys = keys.replace(prefix + "title_count","");
	}

	levelOneRow.append(levelOneColLevel);
	levelOneRow.append(levelOneColWinner);
	levelOneRow.append(levelOneNotes);
	levelOne.append(levelOneRow);
	$("#competitions").append(levelOne);

	keys = keys.replace("|"+level,"");
}
*/