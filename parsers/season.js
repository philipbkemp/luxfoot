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

urlParams = {};
function checkParams(required) {
	paramsOk = true;

	queryString = window.location.search.replace("?","");
	if ( queryString === "" ) {
		if ( required.length !== 0 ) {
			invalid();
			return false;
		}
	}
	queryArray = queryString.split("&");
	queryArray.forEach(q=>{
		key = q.split("=")[0];
		value =  q.split("=")[1];
		urlParams[key] = value;
	});
	
	required.forEach(q=>{
		if ( ! urlParams[q] || urlParams[q] === "" ) {
			invalid();
			paramsOk = false;
		}
	});

	return paramsOk;
}

function invalid() {
	$(".placeholder-glow").append(
		$("<DIV></DIV>").addClass("alert").addClass("alert-danger").html("Unable to load season")
	);
	$("head title").html( $("head title").html().replace("%season%","Oops"));
	$("h1").html( $("h1").html().replace("%season%","Oops"));
	$(".placeholder").hide();
}

seasonToShow = {};
function parseSeasons(data) {
	toShow = data.filter(s=>{return s.season === urlParams.season;});
	if ( toShow.length !== 1 ) {
		invalid();
		return;
	}

	seasonToShow = toShow[0];

	$.ajax({
		url: "data/teams.json",
		success: function(data) {
			parseTeams(data);
		}
	})
}

allTeams = {};
function parseTeams(data) {
	allTeams = data;

	parseSeason();
}

function parseSeason() {
	season = seasonToShow;
	keys = "|" + Object.keys(season).join("|");

	$("head title").html( $("head title").html().replace("%season%",season.season));
	$("h1").html( $("h1").html().replace("%season%",season.season));
	keys = keys.replace("|season","");

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
}

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
	levelOneColLevel = $("<DIV></DIV>").addClass("col-2")

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

	levelOneColWinner = $("<DIV></DIV>").addClass("col-10").addClass("p-1").html(allTeams[data.winner]);
	keys = keys.replace(prefix + "winner","");

	if ( data.count ) {
		levelWinnerCount = $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").html(getTitleCount(data.count));
		levelOneColWinner.append(levelWinnerCount);
		keys = keys.replace(prefix + "count","");
	}

	levelOneRow.append(levelOneColLevel);
	levelOneRow.append(levelOneColWinner);
	levelOne.append(levelOneRow);
	$("#competitions").append(levelOne);

	keys = keys.replace("|"+level,"");
}

function getTitleCount(number) {
	ordinal = number + "th";

	j = number % 10,
	k = number % 100;
	if ( j === 1 && k !== 11 ) {
		ordinal = number + "st";
	}
	if ( j === 2 && k !== 12 ) {
		ordinal = number + "nd";
	}
	if ( j === 3 && k !== 13 ) {
		ordinal = number + "rd";
	}

	return ordinal + " title";
}