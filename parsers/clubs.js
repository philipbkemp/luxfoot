$(document).ready(function(){

    checkParams();

	if ( urlParams["club"] ) {

        console.log("TODO: NEED CLUB");
    
    } else {

        $(".placeholder-glow").addClass("d-none");
        $("#show-empty").removeClass("d-none");
        $("h1 span:not(.lf)").html("Clubs");

    }
	
	/*	$.ajax({
			url: "data/teams.json",
			success: function(data) {
				parseTeams(data);
			}
		});

	}*/

});