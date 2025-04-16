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
	addKeys(Object.keys(season));
	
	setTitles(season.season);
    removeKey("season");

	// winners
	if ( season.leagues && season.leagues.level_1 && season.leagues.level_1.winner ) {
		displayWinner(season.leagues.level_1);
	} else {
		displayWinner(null);
	}
	if ( season.cups && season.cups.cup_luxembourg && season.cups.cup_luxembourg.winner ) {
		displayWinner(season.cups.cup_luxembourg);
	} else {
		displayWinner(null);
	}
	if ( season.cups && season.cups.cup_flf && season.cups.cup_flf.winner ) {
		displayWinner(season.cups.cup_flf);
	} else {
		displayWinner(null);
	}
	if ( season.cups && season.cups.liberation && season.cups.liberation.winner ) {
		displayWinner(season.cups.liberation);
	} else {
		displayWinner(null);
	}

	leagueComp = $("<DIV></DIV>").addClass("col-2");
	if ( season.leagues ) {
		subKeys = Object.keys(season.leagues);
		for ( i=0 ; i!==subKeys.length ; i++ ) {
			subKeys[i] = "leagues." + subKeys[i];
		}
		addKeys(subKeys);
		removeKey("leagues");
		
		leagueCompList = $("<DIV></DIV>").addClass("list-group");
		leagueCompHead = $("<DIV></DIV>").addClass("list-group-item list-group-item-primary").html("Leagues");
		leagueCompList.append(leagueCompHead);
		["level_1","level_2","level_3","level_4","level_5","level_6"].forEach(lvl=>{
			if ( season.leagues[lvl] ) {
				lvlKeys = Object.keys(season.leagues[lvl]);
				for ( i=0 ; i!==lvlKeys.length ; i++ ) {
					lvlKeys[i] = "leagues."+lvl+"." + lvlKeys[i];
				}
				addKeys(lvlKeys);

				if ( ! season.leagues[lvl].missing ) {
					thisLevel = $("<A></A>")
						.addClass("list-group-item")
						.attr("href","league.html?season="+season.season+"&level="+lvl.split("_").pop())
						.html(season.leagues[lvl].name)
						;
				} else {
					thisLevel = $("<DIV></DIV>").addClass("list-group-item").html(season.leagues[lvl].name);
					removeKey("leagues."+lvl+".missing");
				}

				if ( season.leagues[lvl].series ) {
					seriesSpan = $("<SPAN></SPAN>").addClass("series").html( season.leagues[lvl].series.length + " series");
					thisLevel.append(seriesSpan);
					removeKey("leagues."+lvl+".series");
				}
				
				leagueCompList.append(thisLevel);

				removeKey("leagues."+lvl);
				removeKey("leagues."+lvl+".season");
				removeKey("leagues."+lvl+".level");
				removeKey("leagues."+lvl+".name");
				removeKey("leagues."+lvl+".winner");
				removeKey("leagues."+lvl+".title_count");
				removeKey("leagues."+lvl+".double");
			}
		});
		leagueComp.append(leagueCompList);
	}
	$("#competitions").append(leagueComp);
	
	cupComp = $("<DIV></DIV>").addClass("col-2");
	if ( season.cups ) {
		subKeys = Object.keys(season.cups);
		for ( i=0 ; i!==subKeys.length ; i++ ) {
			subKeys[i] = "cups." + subKeys[i];
		}
		addKeys(subKeys)
		removeKey("cups");
		
		cupCompList = $("<DIV></DIV>").addClass("list-group");
		cupCompHead = $("<DIV></DIV>").addClass("list-group-item list-group-item-primary").html("Cups");
		cupCompList.append(cupCompHead);
		["cup_luxembourg","cup_flf","liberation"].forEach(lvl=>{
			if ( season.cups[lvl] ) {
				lvlKeys = Object.keys(season.cups[lvl]);
				for ( i=0 ; i!==lvlKeys.length ; i++ ) {
					lvlKeys[i] = "cups."+lvl+"." + lvlKeys[i];
				}
				addKeys(lvlKeys);

				if ( ! season.cups[lvl].missing ) {
					thisLevel = $("<A></A>")
						.addClass("list-group-item")
						.attr("href","cup.html?season="+season.season+"&comp="+lvl)
						.html(season.cups[lvl].name);
				} else {
					thisLevel = $("<DIV></DIV>").addClass("list-group-item").html(season.cups[lvl].name);
					removeKey("cups."+lvl+".missing");
				}
				
				cupCompList.append(thisLevel);
				removeKey("cups."+lvl);
				removeKey("cups."+lvl+".season");
				removeKey("cups."+lvl+".name");
				removeKey("cups."+lvl+".winner");
				removeKey("cups."+lvl+".title_count");
				removeKey("cups."+lvl+".winner_division");
				removeKey("cups."+lvl+".double");
			}
		});
		cupComp.append(cupCompList);
	}
	$("#competitions").append(cupComp);
	
	euroComp = $("<DIV></DIV>").addClass("col-2");
	if ( season.europe ) {
		subKeys = Object.keys(season.europe);
		for ( i=0 ; i!==subKeys.length ; i++ ) {
			subKeys[i] = "europe." + subKeys[i];
		}
		addKeys(subKeys);
		removeKey("europe");

		euroCompList = $("<DIV></DIV>").addClass("list-group");
		euroCompHead = $("<DIV></DIV>").addClass("list-group-item list-group-item-primary").html("Europe");
		euroCompList.append(euroCompHead);
		["champions_league","europa_league","cup_winners_cup","intertoto_cup","fairs_cup"].forEach(lvl=>{
			if ( season.europe[lvl] ) {
				lvlKeys = Object.keys(season.europe[lvl]);
				for ( i=0 ; i!==lvlKeys.length ; i++ ) {
					lvlKeys[i] = "europe."+lvl+"." + lvlKeys[i];
				}
				addKeys(lvlKeys);
				
				if ( ! season.europe[lvl].missing ) {
					thisLevel = $("<A></A>")
						.addClass("list-group-item")
						.attr("href","europe.html?season="+season.season+"&comp="+lvl)
						.html(season.europe[lvl].name);
				} else {
					thisLevel = $("<DIV></DIV>").addClass("list-group-item").html(season.europe[lvl].name);
					removeKey("europe."+lvl+".missing");
				}

				season.europe[lvl].teams.forEach(t=>{
					seriesSpan = $("<SPAN></SPAN>").addClass("series").html( allTeams[t] );
					thisLevel.append(seriesSpan);
				});

				euroCompList.append(thisLevel);
				removeKey("europe."+lvl);
				removeKey("europe."+lvl+".season");
				removeKey("europe."+lvl+".name");
				removeKey("europe."+lvl+".teams");
			}
		});		
		euroComp.append(euroCompList);
	}
	$("#competitions").append(euroComp);

	if ( season.note ) {
		noteWrap = $("<DIV></DIV>").addClass("col-12");
		note = $("<DIV></DIV>").addClass("alert").addClass("alert-danger").html(season.note);
		noteWrap.append(note);
		$("#competitions").append(noteWrap);
		removeKey("note");
	}

	if ( keys.length !== 0 ) {
		console.log(season);
		console.log(keys);
	}

	$(".placeholder-glow").addClass("d-none");
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
	
	if ( competition ) {
		wrap = $("<DIV></DIV>").addClass("winner-box");
		comp = $("<DIV></DIV>").addClass("winner-box__competition").html(competition.name);
		team = $("<DIV></DIV>").addClass("winner-box__team").html( allTeams[competition.winner] );
		wrap.append(comp).append(team);

		if ( competition.title_count ) {
			nmbr = $("<DIV></DIV>").addClass("winner-box__count").html( getTitleCount(competition.title_count) );
			wrap.append(nmbr);
		}

		col.append(wrap);
	}

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