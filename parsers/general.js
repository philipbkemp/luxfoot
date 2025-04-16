keys = [];
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

/*function drawMatch(match,containerId,prefix,highlightWinner) {
	prefix = "|" + prefix + ".";
	keys += prefix + Object.keys(match).join(prefix) + "|";
	winner = "";

	matchObj = $("<DIV></DIV>").addClass("list-group-item").addClass("match-item");

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
		winner = allTeams[match.home];
	}
	if ( match.homeDivision ) {
		keys += prefix+"homeDivision." + Object.keys(match.homeDivision).join(prefix+"homeDivision.") + "|";
		matchHome.append( $("<BR/>") ).append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("p-0").addClass("m-0").html(match.homeDivision.name) );
		keys = keys.replace(prefix+"homeDivision|","|").replace("||","|");
		keys = keys.replace(prefix+"homeDivision.level|","|").replace("||","|");
		keys = keys.replace(prefix+"homeDivision.series|","|").replace("||","|");
		keys = keys.replace(prefix+"homeDivision.name|","|").replace("||","|");
	}
	matchRow.append(matchHome);
	keys = keys.replace(prefix+"home|","|").replace("||","|");

	matchScore = $("<DIV></DIV>").addClass("col-1").addClass("text-center").html( match.score );
	matchRow.append(matchScore);
	keys = keys.replace(prefix+"score|","|").replace("||","|");

	matchAway = $("<DIV></DIV>").addClass("col-3").html( allTeams[match.away] );
	if ( highlightWinner && scoreH < scoreA ) {
		matchAway.addClass("fw-bold");
		winner = allTeams[match.away];
	}
	if ( match.awayDivision ) {
		keys += prefix+"awayDivision." + Object.keys(match.awayDivision).join(prefix+"awayDivision.") + "|";
		matchAway.append( $("<BR/>") ).append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("p-0").addClass("m-0").html(match.awayDivision.name) );
		keys = keys.replace(prefix+"awayDivision|","|").replace("||","|");
		keys = keys.replace(prefix+"awayDivision.level|","|").replace("||","|");
		keys = keys.replace(prefix+"awayDivision.series|","|").replace("||","|");
		keys = keys.replace(prefix+"awayDivision.name|","|").replace("||","|");
	}
	matchRow.append(matchAway);
	keys = keys.replace(prefix+"away|","|").replace("||","|");

	matchObj.append(matchRow);

	if ( match.promotion ) {
		keys += prefix +"promotion." + Object.keys(match.promotion).join(prefix+"promotion.") + "|";

		matchNoteRow = $("<DIV></DIV>").addClass("row mt-2");
		matchNote = $("<DIV></DIV>").addClass("col-12").addClass("match-note").html(winner + " promoted to ");

		matchNoteLink = $("<A></A>").attr("href","league.html?season="+match.promotion.season+"&level="+match.promotion.level).html(match.promotion.name);
		keys = keys.replace(prefix+"promotion.name|","|").replace("||","|");
		keys = keys.replace(prefix+"promotion.season|","|").replace("||","|");
		keys = keys.replace(prefix+"promotion.level|","|").replace("||","|");

		matchNote.append(matchNoteLink);

		matchNoteRow.append(matchNote);
		matchObj.append(matchNoteRow);
		keys = keys.replace(prefix+"promotion|","|").replace("||","|");
	}

	// not shown
	keys = keys.replace(prefix+"season|","|").replace("||","|");	
	keys = keys.replace(prefix+"competition|","|").replace("||","|");

	$("#"+containerId).append(matchObj);
}*/

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
	if ( $(".alert.alert-danger").length !== 0 ) {
		return;
	}
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

function setTitles(pOne="",pTwo="") {
	titleParts = ["LuxFoot"];
	if ( pOne !== "" ) {
		titleParts.push(pOne);
	}
	if ( pTwo !== "" ) {
		titleParts.push(pTwo);
	}

	$("head title").html( titleParts.join(" / ") );
	$("h1 span").html( titleParts.join(" / ") );
}

function addKeys(newKeys) {
	newKeys.forEach(k=>{
		keys.push(k);
	});
}

function removeKey(oldKey) {
	if ( keys.indexOf(oldKey) !== -1 ) {
		keys.splice(keys.indexOf(oldKey),1);
	}
}