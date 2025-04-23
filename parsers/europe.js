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
	$.ajax({
		url: "seasons/"+urlParams.season+"/europe.json",
		success: function(data) {
			parseEurope(data);
		},
		error: function(data) {
			invalid();
		}
	})
}

function parseEurope(data) {
    console.log( data[urlParams.comp] );
}