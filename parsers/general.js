keys = "";
urlParams = {};
allTeams = {};

function checkParams(required) {
	paramsOk = true;

	queryString = window.location.search.replace("?","");
	if ( queryString === "" ) {
		if ( required.length !== 0 ) {
			invalid();
			return false;
		}
	}
	queryArray = queryString.split("&");
	queryArray.forEach(q=>{
		key = q.split("=")[0];
		value =  q.split("=")[1];
		urlParams[key] = value;
	});
	
	required.forEach(q=>{
		if ( ! urlParams[q] || urlParams[q] === "" ) {
			invalid();
			paramsOk = false;
		}
	});

	return paramsOk;
}

function drawMatch(match,containerId,prefix,highlightWinner) {
	prefix = "|" + prefix + ".";
	keys += prefix + Object.keys(match).join(prefix) + "|";

	matchObj = $("<DIV></DIV>").addClass("list-group-item");

	matchRow = $("<DIV></DIV>").addClass("row");

	matchDate = $("<DIV></DIV>").addClass("col-2");
	if ( match.date ) {
		matchDate.html(match.date);
		//keys = keys.replace(prefix+"date|","|").replace("||","|");
	}
	matchRow.append(matchDate);

	score = match.score.split("-");
	scoreH = parseInt(score[0]);
	scoreA = parseInt(score[1]);

	matchHome = $("<DIV></DIV>").addClass("col-3").addClass("text-end").html( allTeams[match.home] );
	if ( highlightWinner && scoreH > scoreA ) {
		matchHome.addClass("fw-bold");
	}
	matchRow.append(matchHome);
	keys = keys.replace(prefix+"home|","|").replace("||","|");

	matchScore = $("<DIV></DIV>").addClass("col-1").addClass("text-center").html( match.score );
	if ( highlightWinner && scoreH < scoreA ) {
		matchAway.addClass("fw-bold");
	}
	matchRow.append(matchScore);
	keys = keys.replace(prefix+"score|","|").replace("||","|");

	matchAway = $("<DIV></DIV>").addClass("col-3").html( allTeams[match.away] );
	matchRow.append(matchAway);
	keys = keys.replace(prefix+"away|","|").replace("||","|");

	matchObj.append(matchRow);

	// not shown
	keys = keys.replace(prefix+"season|","|").replace("||","|");	
	keys = keys.replace(prefix+"competition|","|").replace("||","|");

	$("#"+containerId).append(matchObj);
}

function getTitleCount(number) {
	ordinal = number + "th";

	j = number % 10,
	k = number % 100;
	if ( j === 1 && k !== 11 ) {
		ordinal = number + "st";
	}
	if ( j === 2 && k !== 12 ) {
		ordinal = number + "nd";
	}
	if ( j === 3 && k !== 13 ) {
		ordinal = number + "rd";
	}

	return ordinal + " title";
}

function invalid() {
	$(".placeholder-glow").append(
		$("<DIV></DIV>").addClass("alert").addClass("alert-danger").html("Unable to load season")
	);
	$("head title").html( $("head title").html().replace("%season% / %league%","Oops"));
	$("h1").html( $("h1").html().replace("%season% / %league%","Oops"));
	$("#seasonLink").hide();
	$(".placeholder").hide();
}

function parseTeams(data) {
	allTeams = data;

	doneParsingTeams();	
}

function setTitles(season="",competition="") {
	titleParts = ["LuxFoot"];
	if ( season !== "" ) {
		titleParts.push(season);
	}
	if ( competition !== "" ) {
		titleParts.push(competition);
	}

	$("head title").html( titleParts.join(" / ") );
	$("h1 span").html( titleParts.join(" / ") );
}