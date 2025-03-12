season = null;
teams = null;

$(document).ready(function(){
	
	queryParams = {};
	window.location.search.replace("?","").split("&").forEach(searchObject=>{
		so = searchObject.split("=");
		queryParams[so[0]] = so[1];
	});

	if ( queryParams.season ) {
		getSeasonData();
	}

});

function getSeasonData() {
	$.ajax({url: "seasons/"+queryParams.season+"/mens_cup.json", success: function(result){
		season = result;
		getTeams();
	}});
}

function getTeams() {
	$.ajax({url: "data/teams.json", success: function(result){
		teams = result;
		displayLeague();
	}});
}

function displayLeague() {
	keys = "|" + Object.keys(season).join("|") + "|";

	// page title
	$("head title").text(season.cup + " | " + season.season + " | LuxFoot");

	// header
	$("h1").text(season.cup + " / " + season.season);

	keys = keys.replace("|season|","|");
	keys = keys.replace("|cup|","|");

	["preliminary","round_1","round_2","last_32","last_16"].forEach(round=>{
		if ( season[round] ) {
			$("#r_"+round).addClass("d-later");
			season[round].forEach(m=>{
				matchRow = buildMatch(m,true);
				$("#r_"+round+" .matches").append(matchRow);
			});
			keys = keys.replace("|"+round+"|","|");
		}
	});

	// todo: display?
	keys = keys.replace("|winners|","|");
	keys = keys.replace("|runnersup|","|");

	if ( keys !== "|" ) {
		console.error(keys);
	}

	// remove placeholders
	$(".placeholder-glow").removeClass("placeholder-glow");
	$(".placeholder").removeClass("placeholder");
	$(".d-none.d-later").removeClass("d-none").removeClass("d-later");
}