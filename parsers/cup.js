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

function parseCup(cup) {
	addKeys(Object.keys(cup));

	setTitles(cup.season,cup.name);
    removeKey("season");
	removeKey("name");

    // do stuff
	hasFirstRound = false;
	cup.rounds.forEach(round=>{		
        roundKeys = Object.keys(round);
        for ( i=0 ; i!==roundKeys.length ; i++ ) {
            roundKeys[i] = "round." + roundKeys[i];
        }
        addKeys(roundKeys);

		$("#cupTabs").append(buildTabButton(round.key,round.name,!hasFirstRound));
        thisRoundPanel = buildTabPanel(round.key,!hasFirstRound);
        removeKey("round.key");
        removeKey("round.name");

		ul = $("<UL></UL>").addClass("mb-5").addClass("list-group");
        round.matches.forEach(match=>{

            if ( ! match.bye ) {
				ul.append( drawMatch(match,true) );
			} else {
				console.log("BYE",match);
			}

        });
		thisRoundPanel.append(ul);
		removeKey("round.matches");

		$("#cupTabContent").append(thisRoundPanel);
        hasFirstRound = true;
	});
	removeKey("rounds");

	if ( keys.length !== 0 ) {
		console.log(cup);
		console.log(keys);
	}

	$(".placeholder-glow").addClass("d-none");
	$(".displayAfterLoad").removeClass("d-none");
}