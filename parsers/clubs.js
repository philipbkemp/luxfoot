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
        trophyPanel = buildTabPanel("league",isFirstTab);

        console.log("TODO: trophies",data.trophies);

        $("#theTabContent").append(trophyPanel);
        isFirstTab = false;
    }

    // standings
    if ( data.standings ) {
        $("#theTabs").append(buildTabButton("standing","League History",isFirstTab));
        standingsPanel = buildTabPanel("league",isFirstTab);
        $("#theTabContent").append(standingsPanel);
        console.log("TODO: standings",data.standings);
        isFirstTab = false;
    }

    // matches
    if ( data.matches ) {
        $("#theTabs").append(buildTabButton("matches","Head-to-Head",isFirstTab));
        matchesPanel = buildTabPanel("league",isFirstTab);

        console.log("TODO: matches",data.matches);

        $("#theTabContent").append(matchesPanel);
        isFirstTab = false;
    }

    // europe
    if ( data.europe ) {
        $("#theTabs").append(buildTabButton("europe","European Record",isFirstTab));
        matchesPanel = buildTabPanel("league",isFirstTab);
        
        console.log("TODO: europe",data.europe);

        $("#theTabContent").append(europePanel);
        $("#theTabContent").append(leaguePanel);
        isFirstTab = false;
    }


    $(".placeholder-glow").addClass("d-none");
    $(".displayAfterLoad").removeClass("d-none");
    $(".showIfClub").removeClass("d-none");
}