$(document).ready(function(){

    checkParams();

	if ( urlParams["club"] ) {

        $.ajax({
			url: "clubs/"+urlParams["club"]+".json",
			success: function(data) {
				parseClub(data);
			},
            error: function(data) {
                $("<DIV></DIV>").addClass("alert").addClass("alert-danger").html("Unable to load club").insertAfter(".lf-nav");
                $(".placeholder").hide();
                $(".displayAfterLoad").removeClass("d-none");
            }
		});
    
    } else {

        $(".placeholder-glow").addClass("d-none");
        $("#show-empty").removeClass("d-none");
        $("h1 span:not(.lf)").html("Clubs");
        $(".displayAfterLoad").removeClass("d-none");

    }

});

function parseClub(data) {
    $("h1 span.lf").append(" / Clubs");
    $("h1 span:not(.lf)").html(data.name);
    $("title").append(" / " + data.name);

    isFirstTab = true;

    // trophies
    if ( data.trophies ) {
        $("#theTabs").append(buildTabButton("trophies","Trophy Cabinet",isFirstTab));
        trophyPanel = buildTabPanel("trophies",isFirstTab);

        trophyPanel.append( drawTrophies(data.trophies) );

        $("#theTabContent").append(trophyPanel);
        isFirstTab = false;
    }

    // standings
    /*if ( data.standings ) {
        $("#theTabs").append(buildTabButton("standing","League History",isFirstTab));
        standingsPanel = buildTabPanel("standing",isFirstTab);
        $("#theTabContent").append(standingsPanel);
        console.log("TODO: standings",data.standings);
        isFirstTab = false;
    }*/

    // matches
    /*if ( data.matches ) {
        $("#theTabs").append(buildTabButton("matches","Head-to-Head",isFirstTab));
        matchesPanel = buildTabPanel("matches",isFirstTab);

        console.log("TODO: matches",data.matches);

        $("#theTabContent").append(matchesPanel);
        isFirstTab = false;
    }*/

    // europe
    /*if ( data.europe ) {
        $("#theTabs").append(buildTabButton("europe","European Record",isFirstTab));
        matchesPanel = buildTabPanel("europe",isFirstTab);
        
        console.log("TODO: europe",data.europe);

        $("#theTabContent").append(europePanel);
        $("#theTabContent").append(leaguePanel);
        isFirstTab = false;
    }*/

    $(".placeholder-glow").addClass("d-none");
    $(".displayAfterLoad").removeClass("d-none");
    $(".showIfClub").removeClass("d-none");
}

function drawTrophies(trophies) {
    trophy = $("<DIV></DIV>").addClass("g-4").addClass("row").addClass("row-cols-6").addClass("trophy-list");

    trophies.forEach(t=>{
        thisTrophy = $("<DIV></DIV>").addClass("col");
        thisTrophyLink = $("<A></A>").addClass("card");
        if ( t.cup ) {
            thisTrophyLink.attr("href","cup.html?season"+t.season+"&comp="+t.cup)
        } else if ( t.league ) {
            thisTrophyLink.attr("href","league.html?season"+t.season+"&level=1")
        }
        thisTrophyImg = $("<DIV></DIV>").addClass("card-img").html(t.title_count);
        thisTrophyBody = $("<DIV></DIV>").addClass("card-body");
        thisTrophyComp = $("<STRONG></STRONG>").addClass("card-title").html(t.name);
        thisTrophySeason =$("<P></P>").addClass("card-text").html(t.season);
        thisTrophyBody.append(thisTrophyComp).append(thisTrophySeason);
        thisTrophyLink.append(thisTrophyImg).append(thisTrophyBody);
        thisTrophy.append(thisTrophyLink);
        trophy.append(thisTrophy);
    });

    return trophy;
}