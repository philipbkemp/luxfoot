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
    if ( ! data[urlParams.comp] ) {
        invalid();
    } else {
        parseEuropeanCompetition(data[urlParams.comp]);
    }
}

function parseEuropeanCompetition(comp) {
    addKeys(Object.keys(comp));

    setTitles(comp.season,comp.name);
    removeKey("season");
    removeKey("name");

    $("#menu-links").append(
		$("<LI></LI>").append(
			$("<A></A>").addClass("p-2").attr("href","season.html?season="+comp.season).html("Season overview")
		)
	);
	if ( comp.links ) {
		linkKeys = Object.keys(comp.links);
		for ( i=0 ; i!==linkKeys.length ; i++ ) {
			linkKeys[i] = "links." + linkKeys[i];
		}
		addKeys(linkKeys);
		if ( comp.links.next ) {
			$("#menu-links").append(
				$("<LI></LI>").append(
					$("<A></A>").addClass("p-2").attr("href","europe.html?season="+comp.links.next+"&comp="+urlParams.comp).html("Next season")
				)
			);
			removeKey("links.next");
		}
		if ( comp.links.prev ) {
			$("#menu-links").append(
				$("<LI></LI>").append(
					$("<A></A>").addClass("p-2").attr("href","europe.html?season="+comp.links.prev+"&comp="+urlParams.comp).html("Previous season")
				)
			);
			removeKey("links.prev");
		}
		removeKey("links");
	}

    hasFirstRound = false;
    comp.rounds.forEach(round=>{
        roundKeys = Object.keys(round);
        for ( i=0 ; i!==roundKeys.length ; i++ ) {
            roundKeys[i] = "round." + roundKeys[i];
        }
        addKeys(roundKeys);

        $("#europeTabs").append(buildTabButton(round.key,round.name,!hasFirstRound));
        thisRoundPanel = buildTabPanel(round.key,!hasFirstRound);
        thisRoundPanel.html(round.name + "<br /> hello");

        removeKey("round.key");
        removeKey("round.name");

        $("#europeTabContent").append(thisRoundPanel);

        hasFirstRound = true;

        removeKey("rounds");
    });

    removeKey("teams");

	if ( keys.length !== 0 ) {
		console.log(comp);
		console.log(keys);
	}

	$(".placeholder-glow").addClass("d-none");
	$(".displayAfterLoad").removeClass("d-none");
}