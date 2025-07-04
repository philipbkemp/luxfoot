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
		url: "seasons/"+seasonPath(urlParams.season)+"/"+comp+".json",
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

	$("#menu-links").append(
		$("<A></A>").attr("href","season.html?season="+cup.season).html("Season").addClass("float-end")
	);
	if ( cup.links ) {
		linkKeys = Object.keys(cup.links);
		for ( i=0 ; i!==linkKeys.length ; i++ ) {
			linkKeys[i] = "links." + linkKeys[i];
		}
		addKeys(linkKeys);
		if ( cup.links.prev ) {
			$("#menu-links").append(
				$("<A></A>").attr("href","cup.html?season="+cup.links.prev+"&comp="+urlParams.comp).html("Previous")
			);
			removeKey("links.prev");
		}
		if ( cup.links.next ) {
			$("#menu-links").append(
				$("<A></A>").attr("href","cup.html?season="+cup.links.next+"&comp="+urlParams.comp).html("Next")
			);
			removeKey("links.next");
		}
		removeKey("links");
	}

	setTitles(cup.season,cup.name);
    removeKey("season");
	removeKey("name");

	removeKey("winner");
	removeKey("title_count");

    // do stuff
	hasFirstRound = false;
	cup.rounds.forEach(round=>{		
        roundKeys = Object.keys(round);
        for ( i=0 ; i!==roundKeys.length ; i++ ) {
            roundKeys[i] = "round." + roundKeys[i];
        }
        addKeys(roundKeys);

		$("#cupTabs").append(buildTabButton(round.key,round.name,!hasFirstRound,false,cup.shortTabs?true:false));
        thisRoundPanel = buildTabPanel(round.key,!hasFirstRound);
        removeKey("round.key");
        removeKey("round.name");

		ul = $("<UL></UL>").addClass("mb-5").addClass("list-group");
        round.matches.forEach(match=>{

            if ( ! match.bye ) {
				ul.append( drawMatch(match,true) );
			} else {	
				matchKeys = Object.keys(match);
				for ( i=0 ; i!==matchKeys.length ; i++ ) {
					matchKeys[i] = "match." + matchKeys[i];
				}
				addKeys(matchKeys);
				ul.append(
					$("<LI></LI>").addClass("list-group-item").addClass("match-item").append(
						$("<DIV></DIV>").addClass("match-note").html(
							allTeams[match.bye]
							+ " (" + match.byeDivision.name + ") "
							+ "received a bye to the next round"
						)
					)
				);
				removeKey("match.bye");
				removeKey("match.byeDivision");
			}

        });
		thisRoundPanel.append(ul);
		removeKey("round.matches");

		$("#cupTabContent").append(thisRoundPanel);
        hasFirstRound = true;
	});
	removeKey("rounds");
	removeKey("cup");
	removeKey("shortTabs");

	if ( keys.length !== 0 ) {
		console.log(cup);
		console.log(keys);
	}

	$(".placeholder-glow").addClass("d-none");
	$(".displayAfterLoad").removeClass("d-none");
}