allEuropeTeams = {};

$(document).ready(function(){

    $.ajax({
        url: "../data/teams_europe.json",
        success: function(data) {
            Object.keys(data).forEach(country=>{
                Object.keys(data[country]).forEach(team=>{
                    if ( team !== "_country" ) {
                        allEuropeTeams[ country + ":" + team ] = data[country][team].name;
                    } else {
                        allEuropeTeams[ country ] = data[country]._country;
                    }
                });
            });
            doneParsingEuropeanTeams();
        }
    });

});

function doneParsingEuropeanTeams() {

    $.ajax({
        url: "../data/teams.json",
        success: function(data) {
            parseTeams(data);
        }
    });

}

function doneParsingTeams() {
    if ( $("#date_year").length !== 0 ) {
        $("#date_year").val(new Date().getFullYear()).on("change",updateDate);
        $("#date_month").val(new Date().getMonth()+1).on("change",updateDate);
        $("#date_day").val(new Date().getDate()).on("change",updateDate);
        updateDate();
    }

    if ( $("#season").length !== 0 ) {
        $("#season").val("2025-26");
    }

    $("#generate_europe").on("click",generateEurope);
    $("#home").on("change",checkHomeTeam);
    $("#away").on("change",checkAwayTeam);

    $(".placeholder-glow").addClass("d-none");
	$(".displayAfterLoad").removeClass("d-none");
};

function checkHomeTeam() {
    $("#home").val( $("#home").val().toUpperCase() );
    if ( allTeams[$("#home").val()] ) {
        $("#home_team").val(allTeams[$("#home").val()])
    } else if ( allEuropeTeams[$("#home").val()] ) {
        $("#home_team").val(allEuropeTeams[$("#home").val()])
    } else {
        $("#home_team").val("---");
    }
}

function checkAwayTeam() {
    $("#away").val( $("#away").val().toUpperCase() );
    if ( allTeams[$("#away").val()] ) {
        $("#away_team").val(allTeams[$("#away").val()])
    } else if ( allEuropeTeams[$("#away").val()] ) {
        $("#away_team").val(allEuropeTeams[$("#away").val()])
    } else {
        $("#away_team").val("---");
    }
}

function generateEurope() {
    matchObj = {};
    matchObj.isEurope = true;
    matchObj.date = $("#date_val").val();
    matchObj.leg = $("#leg").val();
    matchObj.home = $("#home").val();    
    matchObj.away = $("#away").val();
    matchObj.score = $("#score").val();
    matchObj.season = $("#season").val();
    matchObj.competition = {};
    matchObj.competition.type = "europe";
    matchObj.competition.cup = $("#competition_cup").val();
    compName = "";
    if ( matchObj.competition.cup === "champions_league" ) {
        compName = "Champions League";
    } else if ( matchObj.competition.cup === "europa_league" ) {
        compName = "Europa League";
    } else if ( matchObj.competition.cup === "conference_league" ) {
        compName = "Conference League";
    }
    matchObj.competition.name =compName;
    matchObj.competition.round = $("#competition_round").val();
    matchObj.competition.leg = $("#leg").val();

    $("#code").html(JSON.stringify(matchObj));
}

function updateDate() {
    $("#date_val").val(
        $("#date_year").val()
        +"-"+
        $("#date_month").val().padStart(2,"0")
        +"-"+
        $("#date_day").val().padStart(2,"0")
    )
}