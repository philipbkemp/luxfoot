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

function drawMatch(match,highlightWinner=false) {
	subKeys = Object.keys(match);
	for ( i=0 ; i!==subKeys.length ; i++ ) {
		subKeys[i] = "match." + subKeys[i];
	}
	addKeys(subKeys);

	matchObj = $("<DIV></DIV>").addClass("list-group-item").addClass("match-item");

	matchRow = $("<DIV></DIV>").addClass("row");

	matchDate = $("<DIV></DIV>").addClass("col-2");
	if ( match.date ) {
		matchDate.html(match.date);
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
		matchHome.append( $("<BR/>") ).append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("fw-normal").addClass("text-black-50").addClass("p-0").addClass("m-0").html(match.homeDivision.name) );
	}
	matchRow.append(matchHome);

	matchScore = $("<DIV></DIV>").addClass("col-1").addClass("text-center").html( match.score );
	matchRow.append(matchScore);

	matchAway = $("<DIV></DIV>").addClass("col-3").html( allTeams[match.away] );
	if ( highlightWinner && scoreH < scoreA ) {
		matchAway.addClass("fw-bold");
		winner = allTeams[match.away];
	}
	if ( match.awayDivision ) {
		matchAway.append( $("<BR/>") ).append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("fw-normal").addClass("text-black-50").addClass("p-0").addClass("m-0").html(match.awayDivision.name) );
	}
	matchRow.append(matchAway);

	matchObj.append(matchRow);

	if ( match.outcome ) {
		matchNoteRow = $("<DIV></DIV>").addClass("row mt-2");

		theOutcome = match.outcome
			.replace(match.home,allTeams[match.home])
			.replace(match.away,allTeams[match.away])
			.replace("TARGET","<a href='league.html?season="+match.target.season+"&level="+match.target.level+"'>"+match.target.season+" "+match.target.name+"</a>")
			;

		matchNote = $("<DIV></DIV>").addClass("col-12").addClass("match-note").html(theOutcome);

		matchNoteRow.append(matchNote);
		matchObj.append(matchNoteRow);
		removeKey("match.outcome");
		removeKey("match.target");
	}

	removeKey("match.home");
	removeKey("match.away");
	removeKey("match.score");
	removeKey("match.season");
	removeKey("match.competition");

	return matchObj;
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

function buildTabButton(code,label,active=false,missing=false) {
	tabBtn = $("<LI></LI>")
		.addClass("nav-item")
		.attr("role","presentation")
		;
	
	tabBtnBtn = $("<BUTTON></BUTTON>")
		.addClass("nav-link")
		.attr("id",code+"-tab")
		.attr("data-bs-toggle","tab")
		.attr("data-bs-target","#"+code+"-tab-pane")
		.attr("type","button")
		.attr("role","tab")
		.attr("aria-controls",code+"-tab-pane")
		.html(label)
		;

	if ( missing ) {
		tabBtnBtn.addClass("opacity-25");
	}

	if ( active ) {
		tabBtnBtn
			.addClass("active")
			.attr("aria-selected","true")
			;
	}

	tabBtn.append(tabBtnBtn);

	return tabBtn;
}

function buildTabPanel(code,active=false) {
	panel = $("<DIV></DIV>")
		.addClass("tab-pane")
		.addClass("fade")
		.addClass("pt-4")
		.addClass("tab-pane__"+code)
		.attr("id",code+"-tab-pane")
		.attr("role","tabpanel")
		.attr("aria-labelledby",code+"-tab")
		.attr("tabindex",0)
		;
	
	if ( active ) {
		panel
			.addClass("show")
			.addClass("active")
			;
	}

	return panel;
}