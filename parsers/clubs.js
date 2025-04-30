$(document).ready(function(){

    checkParams();

	if ( urlParams["club"] ) {

        $.ajax({
			url: "clubs/"+urlParams["club"]+".json",
			success: function(data) {
				parseClub(data);
			},
            error: function(data) {
                $("<DIV></DIV>").addClass("alert").addClass("alert-danger").html("Unable to load club").insertBefore(".lf-nav");
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
    console.log(data);

    $("h1 span.lf").append(" / Clubs");
    $("h1 span:not(.lf)").html(data.name);
    $("title").append(" / " + data.name);

    
    // trophies

    // standings

    // matches

    $(".placeholder-glow").addClass("d-none");
    $(".displayAfterLoad").removeClass("d-none");
}