keys = [];
urlParams = {};
allTeams = {};
months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function checkParams(required=[]) {
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
		d = new Date(match.date);
		matchDate.html(
			(d.getDate()+"").padStart(2,"0")
			+ " " +
			months[d.getMonth()]
			+ " " +
			d.getFullYear()
		);
		removeKey("match.date");
	}
	matchRow.append(matchDate);

	score = match.score.split("-");
	scoreH = parseInt(score[0]);
	scoreA = parseInt(score[1]);

	winner = "";
	if ( scoreH > scoreA ) { winner = "home"; }
	else if ( scoreH < scoreA ) { winner = "away"; }
	else if ( match.penalties ) {
		scorePen = match.penalties.split("-");
		scorePH = parseInt(scorePen[0]);
		scorePA = parseInt(scorePen[1]);
		if ( scorePH > scorePA ) { winner = "home"; }
		else if ( scorePH < scorePA ) { winner = "away"; }
	}

	matchHome = $("<DIV></DIV>").addClass("col-3").addClass("text-end").addClass("club-home");
	if ( ! match.isEurope ) {
		if ( allTeams[match.home] ) {
			matchHome.html( allTeams[match.home] );
		} else if ( allTeams[match.home.split(":")[0]] ) {
			matchHome.html( allTeams[match.home.split(":")[0]] + " II" );
		}
	} else {
		if ( allTeams[match.home] ) {
			matchHome.html( allTeams[match.home] );
		} else if ( allTeams[match.home.split(":")[0]] ) {
			matchHome.html( allTeams[match.home.split(":")[0]] + " II" );
		} else if ( allEuropeTeams[match.home] ) {
			matchHome.html( allEuropeTeams[match.home] );
			country = match.home.split(":")[0];
			matchHome.append(
				$("<IMG/>").attr("src","assets/flags/"+country+".png").attr("alt",allEuropeTeams[country]).attr("title",allEuropeTeams[country]).addClass("europe-flag")
			);
		}
	}
	if ( highlightWinner && winner === "home" ) {
		matchHome.addClass("fw-bold");
		winner = allTeams[match.home];
	}
	if ( match.homeDivision ) {
		matchHome.append( $("<BR/>") ).append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("fw-normal").addClass("text-black-50").addClass("p-0").addClass("m-0").html(match.homeDivision.name) );
		removeKey("match.homeDivision");
	}
	matchRow.append(matchHome);

	matchScore = $("<DIV></DIV>").addClass("col-1").addClass("text-center").html( match.score );
	if ( match.aet ) {
		matchScore.append( $("<BR />") );
		matchScore.append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("fst-italic").addClass("fw-normal").addClass("text-black-50").html("aet") );
		removeKey("match.aet");
	}
	if ( match.penalties ) {
		matchScore.append( $("<BR />") );
		matchScore.append( match.penalties );
		matchScore.append( $("<BR />") );
		matchScore.append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("fst-italic").addClass("fw-normal").addClass("text-black-50").html("penalties") );
		
		removeKey("match.penalties");
	}
	if ( match.forfeit ) {
		matchScore.append( $("<BR />") );
		matchScore.append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("fst-italic").addClass("fw-normal").addClass("text-black-50").html("forfeit") );
		removeKey("match.forfeit");
	}
	
	if ( match.postponed ) {
		matchScore.html( "Postponed" );
		matchScore.addClass("badge").addClass("badge-titleCount").addClass("fst-italic").addClass("fw-normal").addClass("text-black-50").addClass("pt-3");
		removeKey("match.postponed");
	}
	
	matchRow.append(matchScore);

	matchAway = $("<DIV></DIV>").addClass("col-3").addClass("club-away");
	if ( ! match.isEurope || allTeams[match.away] ) {
		if ( allTeams[match.away] ) {
			matchAway.html( allTeams[match.away]);
		} else if ( allTeams[match.away.split(":")[0]] ) {
			matchAway.html( allTeams[match.away.split(":")[0]] + " II" );
		}
	} else {
		if ( allTeams[match.away] ) {
			matchAway.html( allTeams[match.away]);
		} else if ( allTeams[match.away.split(":")[0]] ) {
			matchAway.html( allTeams[match.away.split(":")[0]] + " II" );
		} else if ( allEuropeTeams[match.away] ) {
			matchAway.html( allEuropeTeams[match.away] );
			country = match.away.split(":")[0];
			matchAway.prepend(
				$("<IMG/>").attr("src","assets/flags/"+country+".png").attr("alt",allEuropeTeams[country]).attr("title",allEuropeTeams[country]).addClass("europe-flag")
			);
		}
	}
	if ( highlightWinner && winner === "away" ) {
		matchAway.addClass("fw-bold");
		winner = allTeams[match.away];
	}
	if ( match.awayDivision ) {
		matchAway.append( $("<BR/>") ).append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("fw-normal").addClass("text-black-50").addClass("p-0").addClass("m-0").html(match.awayDivision.name) );
		removeKey("match.awayDivision");
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
	if ( match.agg ) {
		aggKeys = Object.keys(match.agg);
		for ( i=0 ; i!==aggKeys.length ; i++ ) {
			aggKeys[i] = "match.agg." + aggKeys[i];
		}
		addKeys(aggKeys);

		matchNoteRow = $("<DIV></DIV>").addClass("row mt-2");

		if ( match.agg.outcome === "W" ) {
			theOutcome = allTeams[match.agg.team] + " win " + match.agg.score + " on aggregate";
		} else if ( match.agg.outcome === "L" ) {
			theOutcome = allTeams[match.agg.team] + " lose " + match.agg.score + " on aggregate";
		}

		matchNote = $("<DIV></DIV>").addClass("col-12").addClass("match-note").html(theOutcome);

		matchNoteRow.append(matchNote);
		matchObj.append(matchNoteRow);
		removeKey("match.agg.score");
		removeKey("match.agg.outcome");
		removeKey("match.agg.team");
		removeKey("match.agg");
	}
	if ( match.note ) {
		matchNoteRow = $("<DIV></DIV>").addClass("row mt-2");
		matchNote = $("<DIV></DIV>").addClass("col-12").addClass("match-note").html(match.note);
		matchNoteRow.append(matchNote);
		matchObj.append(matchNoteRow);
		removeKey("match.note");
	}

	removeKey("match.home");
	removeKey("match.away");
	removeKey("match.score");
	removeKey("match.season");
	removeKey("match.competition");
	removeKey("match.isEurope");
	removeKey("match.leg");

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
	
	if ( titleParts.length === 1 ) {
		$("h1 span").html( titleParts[0] );
	} else if ( titleParts.length === 2 ) {
		$("h1 span:not(.lf)").html( titleParts[1] );
		$("h1 span.lf").html( titleParts[0] );
	} else if ( titleParts.length === 3 ) {
		$("h1 span").html( titleParts[2] );
		$("h1").prepend( $("<SPAN></SPAN>").addClass("lf").html(titleParts[0] + " / " + titleParts[1]) );
	}
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

function seasonPath(season) {
	s = season.split("-");
	s[0] = s[0].split("");

	parts = [
		s[0][0]+""+s[0][1],
		s[0][2],
		s[0][3]+"-"+s[1]
	];

	return parts.join("/");
}