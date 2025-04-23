resultNotes = [];

$(document).ready(function(){

	if ( checkParams(["season","comp"]) ) {
	
		$.ajax({
			url: "data/teams.json",
			success: function(data) {
				parseTeams(data);
			}
		});

	}

});

function doneParsingTeams() {
	comp = urlParams.comp;

	$.ajax({
		url: "seasons/"+urlParams.season+"/"+comp+".json",
		success: function(data) {
			parseCup(data);
		},
		error: function(data) {
			invalid();
		}
	})
}

function parseLeague(cup) {
	addKeys(Object.keys(cup));

	setTitles(cup.season,cup.name);
    removeKey("season");
	removeKey("name");

    // do stuff

	if ( keys.length !== 0 ) {
		console.log(cup);
		console.log(keys);
	}

	$(".placeholder-glow").addClass("d-none");
	$(".displayAfterLoad").removeClass("d-none");
}