$(document).ready(function(){

    checkParams();

	if ( urlParams["country"] ) {

        console.log("TODO: NEED CLUB");
    
    } else {

        $(".placeholder-glow").addClass("d-none");
        $("#show-empty").removeClass("d-none");

    }
	
	/*	$.ajax({
			url: "data/teams.json",
			success: function(data) {
				parseTeams(data);
			}
		});

	}*/

});