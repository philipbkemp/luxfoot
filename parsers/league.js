$(document).ready(function(){

	if ( checkParams(["season","level"]) ) {
	
		$.ajax({
			url: "data/teams.json",
			success: function(data) {
				parseTeams(data);
			}
		})

	}

});

urlParams = {};
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

function invalid() {
	$(".placeholder-glow").append(
		$("<DIV></DIV>").addClass("alert").addClass("alert-danger").html("Unable to load season")
	);
	$("head title").html( $("head title").html().replace("%season% / %league%","Oops"));
	$("h1").html( $("h1").html().replace("%season% / %league%","Oops"));
	$("#seasonLink").hide();
	$(".placeholder").hide();
}

allTeams = {};
function parseTeams(data) {
	allTeams = data;

	level = urlParams.level;
	if ( urlParams.series ) {
		level += "_" + urlParams.series;
	}

	$.ajax({
		url: "seasons/"+urlParams.season+"/level_"+level+".json",
		success: function(data) {
			parseLeague(data);
		},
		error: function(data) {
			invalid();
		}
	})
}

keys = "";
function parseLeague(league) {
	keys = "|" + Object.keys(league).join("|") + "|";
	keys = keys.replace("||","|");

	$("head title").html( $("head title").html().replace("%season%",league.season).replace("%league%",league.name) );
	$("h1").html( $("h1").html().replace("%season%",league.season).replace("%league%",league.name) );
	$("#seasonLink").html( league.season );
	$("#seasonLink").attr( "href", "season.html?season="+league.season );
	keys = keys.replace("|season|","|").replace("||","|");
	keys = keys.replace("|name|","|").replace("||","|");

	if ( league.pts_win ) {
		league.standings.forEach(standing=>{parseStanding(standing,league.pts_win)});
		keys = keys.replace("|pts_win|","|").replace("||","|");
	} else {
		league.standings.forEach(standing=>{parseStanding(standing)});
	}
	keys = keys.replace("|standings|","|").replace("||","|");

	if ( league.relegation ) {
		keys += "|relegation." + Object.keys(league.relegation).join("|relegation.") + "|";
		keys = keys.replace("||","|");

		keys += "|relegation.target." + Object.keys(league.relegation.target).join("|relegation.target.") + "|";
		keys = keys.replace("|relegation.target|","|").replace("||","|");

		$(".is_relegated .badge-titleCount").html("Relegated to "+league.relegation.target.name);
		keys = keys.replace("|relegation.target.season|","|").replace("||","|");
		keys = keys.replace("|relegation.target.name|","|").replace("||","|");

		keys = keys.replace("|relegation|","|").replace("||","|");
		keys = keys.replace("|relegation.teams|","|").replace("||","|");
		keys = keys.replace("|relegation.target.level|","|").replace("||","|");
	}

	if ( league.promotion ) {
		keys += "|promotion." + Object.keys(league.promotion).join("|promotion.") + "|";
		keys = keys.replace("||","|");

		keys += "|promotion.target." + Object.keys(league.promotion.target).join("|promotion.target.") + "|";
		keys = keys.replace("|promotion.target|","|").replace("||","|");

		$(".is_promoted .badge-titleCount").html("Promoted to "+league.promotion.target.name);
		keys = keys.replace("|promotion.target.season|","|").replace("||","|");
		keys = keys.replace("|promotion.target.name|","|").replace("||","|");

		keys = keys.replace("|promotion|","|").replace("||","|");
		keys = keys.replace("|promotion.teams|","|").replace("||","|");
		keys = keys.replace("|promotion.target.level|","|").replace("||","|");
	}

	if ( league.matches ) {
		$("#tabResults").removeClass("d-none");

		$("#resultsTable").attr("data-teams",league.teams.length);

		$("#resultsTable thead tr").append( $("<TH></TH>").html("Home \\ Away") );
		league.teams.forEach(team=>{
			$("#resultsTable thead tr").append( $("<TH></TH>").html("<abbr title='"+allTeams[team]+"'>"+team+"</abbr>") );
		});
		league.teams.forEach(homeTeam=>{
			row = $("<TR></TR>");
			row.append( $("<TH></TH>").html( allTeams[homeTeam] ) );

			league.teams.forEach(awayTeam=>{
				if ( homeTeam !== awayTeam ) {
					res = league.matches.filter(m=>{return m.home===homeTeam && m.away === awayTeam;});
					if ( res.length === 0 ) {
						console.error("Missing " + homeTeam + " v. " + awayTeam);
					} else {
						theMatch = res[0];
						keys += "|matches." + Object.keys(theMatch).join("|matches.") + "|";
						keys = keys.replace("||","|");

						keys = keys.replace("|matches.home|","|").replace("||","|");
						keys = keys.replace("|matches.away|","|").replace("||","|");

						score = theMatch.score.split("-");
						scoreH = parseInt(score[0]);
						scoreA = parseInt(score[1]);
						scoreClass = "draw";
						if ( scoreH > scoreA ) {
							scoreClass = "homeWin";
						} else if ( scoreH < scoreA ) {
							scoreClass = "awayWin";
						}
						row.append( $("<TD></TD>").html(theMatch.score).addClass(scoreClass) );

						keys = keys.replace("|matches.score|","|").replace("||","|");

						// not shown
						keys = keys.replace("|matches.season|","|").replace("||","|");
						keys = keys.replace("|matches.competition|","|").replace("||","|");
					}
				} else {
					row.append( $("<TD></TD>").html( "" ).addClass("noMatch") );
				}
			});

			$("#resultsTable tbody").append(row);
		});

		keys = keys.replace("|matches|","|").replace("||","|");
	}

	if ( league.playoff ) {
		$("#tabPlayoff").removeClass("d-none");
		league.playoff.forEach(match=>{
			drawMatch(match,"matches_playoff","playoff",true);
		});
		keys = keys.replace("|playoff|","|").replace("||","|");
	}

	// not shown
	keys = keys.replace("|level|","|").replace("||","|");
	keys = keys.replace("|teams|","|").replace("||","|");
	keys = keys.replace("|champion|","|").replace("||","|");
	keys = keys.replace("|series|","|").replace("||","|");

	if ( keys !== "|" ) {
		console.warn(keys);
		console.log(league);
	}

	$(".placeholder-glow").hide();
	$("#tabs").removeClass("d-none");
}

function parseStanding(standing,pts_win=3) {
	keys += "|standings." + Object.keys(standing).join("|standings.") + "|";
	keys = keys.replace("||","|");

	standingRow = $("<TR></TR>").attr("id","s_"+standing.team);

	standingPlace = $("<TD></TD>").html(standing.place);
	keys = keys.replace("|standings.place|","|").replace("||","|");

	standingTeam = $("<TH></TH>").html(allTeams[standing.team]);
	keys = keys.replace("|standings.team|","|").replace("||","|");

	standingP = $("<TD></TD>").html(standing.w + standing.d + standing.l);
	standingW = $("<TD></TD>").html(standing.w);
	standingD = $("<TD></TD>").html(standing.d);
	standingL = $("<TD></TD>").html(standing.l);
	standingPts = $("<TD></TD>").html( ((standing.w*pts_win)+standing.d) );
	keys = keys.replace("|standings.w|","|").replace("||","|");
	keys = keys.replace("|standings.d|","|").replace("||","|");
	keys = keys.replace("|standings.l|","|").replace("||","|");

	standingF = $("<TD></TD>").html(standing.f);
	standingA = $("<TD></TD>").html(standing.a);
	standingGd = $("<TD></TD>").html(standing.f - standing.a);
	keys = keys.replace("|standings.f|","|").replace("||","|");
	keys = keys.replace("|standings.a|","|").replace("||","|");

	if ( pts_win !== 3 ) {
		$("#pts_win").attr("title",pts_win+" Point"+(pts_win!==1?"s":"")+" for a win");
	}

	standingNotes = $("<TD></TD>").html("").addClass("ps-4");

	if ( standing.champion ) {
		standingRow.addClass("is_champion");
		standingNotes.append( $("<IMG/>").attr("src","assets/trophy.png").attr("alt","Champion").attr("title","Champion") );
		standingNotes.append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").html( getTitleCount(standing.title_count) ) );
		keys = keys.replace("|standings.champion|","|").replace("||","|");
		keys = keys.replace("|standings.title_count|","|").replace("||","|");
	}

	if ( standing.relegated ) {
		standingRow.addClass("is_relegated");
		standingNotes.append( $("<IMG/>").attr("src","assets/relegated.png").attr("alt","Relegated").attr("title","Relegated") );
		standingNotes.append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").html( "" ) );
		keys = keys.replace("|standings.relegated|","|").replace("||","|");
	}

	if ( standing.promoted ) {
		standingRow.addClass("is_promoted");
		standingNotes.append( $("<IMG/>").attr("src","assets/promoted.png").attr("alt","Promoted").attr("title","Promoted") );
		standingNotes.append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").html( "" ) );
		keys = keys.replace("|standings.promoted|","|").replace("||","|");
	}

	standingRow.append(standingPlace).append(standingTeam).append(standingP).append(standingW).append(standingD).append(standingL).append(standingF).append(standingA).append(standingPts).append(standingGd).append(standingNotes);

	$("#standingsTable tbody").append(standingRow);

	// not shown
	keys = keys.replace("|standings.season|","|").replace("||","|");
	keys = keys.replace("|standings.level|","|").replace("||","|");	
	keys = keys.replace("|standings.league|","|").replace("||","|");
	keys = keys.replace("|standings.series|","|").replace("||","|");
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