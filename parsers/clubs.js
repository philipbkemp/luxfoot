$(document).ready(function(){

    checkParams();

	if ( urlParams["club"] ) {

        $.ajax({
			url: "clubs/"+urlParams["club"]+".json",
			success: function(data) {
				parseClub(data);
			}
		});
    
    } else {

        $(".placeholder-glow").addClass("d-none");
        $("#show-empty").removeClass("d-none");
        $("h1 span:not(.lf)").html("Clubs");

    }

});

function parseClub(data) {
    console.log(data);

    $("h1 span.lf").append(" / Clubs");
    $("h1 span:not(.lf)").html(data.name);
}