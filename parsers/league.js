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

function doneParsingTeams() {
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

function parseLeague(league) {
	keys = "|" + Object.keys(league).join("|") + "|";
	keys = keys.replace("||","|");

	setTitles(league.season,league.name);
	$("#seasonLink").html( league.season ).attr( "href", "season.html?season="+league.season ).removeClass("d-none");
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

		$(".is_relegated .badge-titleCount.relegate").html("Relegated to "+league.relegation.target.name).attr("href","league.html?season="+league.relegation.target.season+"&level="+league.relegation.target.level);
		keys = keys.replace("|relegation.target.season|","|").replace("||","|");
		keys = keys.replace("|relegation.target.name|","|").replace("||","|");
		keys = keys.replace("|relegation.target.level|","|").replace("||","|");

		keys = keys.replace("|relegation|","|").replace("||","|");
		keys = keys.replace("|relegation.teams|","|").replace("||","|");
	}

	if ( league.promotion ) {
		keys += "|promotion." + Object.keys(league.promotion).join("|promotion.") + "|";
		keys = keys.replace("||","|");

		keys += "|promotion.target." + Object.keys(league.promotion.target).join("|promotion.target.") + "|";
		keys = keys.replace("|promotion.target|","|").replace("||","|");

		$(".is_promoted .badge-titleCount.promote").html("Promoted to "+league.promotion.target.name).attr("href","league.html?season="+league.promotion.target.season+"&level="+league.promotion.target.level);
		keys = keys.replace("|promotion.target.season|","|").replace("||","|");
		keys = keys.replace("|promotion.target.name|","|").replace("||","|");
		keys = keys.replace("|promotion.target.level|","|").replace("||","|");

		keys = keys.replace("|promotion|","|").replace("||","|");
		keys = keys.replace("|promotion.teams|","|").replace("||","|");
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

	if ( league.level_playoff ) {
		$("#tabLevelPlayoff").removeClass("d-none");
		league.level_playoff.forEach(match=>{
			drawMatch(match,"matches_level_playoff","level_playoff",true);
		});
		keys = keys.replace("|level_playoff|","|").replace("||","|");
	}

	// not shown
	keys = keys.replace("|level|","|").replace("||","|");
	keys = keys.replace("|teams|","|").replace("||","|");
	keys = keys.replace("|champion|","|").replace("||","|");
	keys = keys.replace("|excluded|","|").replace("||","|");
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
		standingNotes.append( $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").addClass("champion").html( getTitleCount(standing.title_count) ) );
		keys = keys.replace("|standings.champion|","|").replace("||","|");
		keys = keys.replace("|standings.title_count|","|").replace("||","|");
	}

	if ( standing.relegated ) {
		standingRow.addClass("is_relegated");
		standingNotes.append( $("<IMG/>").attr("src","assets/relegated.png").attr("alt","Relegated").attr("title","Relegated") );
		standingNotes.append( $("<A></A>").addClass("badge").addClass("badge-titleCount").addClass("relegate").html( "" ) );
		keys = keys.replace("|standings.relegated|","|").replace("||","|");
	}

	if ( standing.promoted ) {
		standingRow.addClass("is_promoted");
		standingNotes.append( $("<IMG/>").attr("src","assets/promoted.png").attr("alt","Promoted").attr("title","Promoted") );
		standingNotes.append( $("<A></A>").addClass("badge").addClass("badge-titleCount").addClass("promote").html( "" ) );
		keys = keys.replace("|standings.promoted|","|").replace("||","|");
	}

	if ( standing.playoff ) {
		standingRow.addClass("go_playoff");
		playoff = "Play-off";
		switch ( standing.playoff ) {
			case "level_playoff": playoff = "Promotion play-off"; break;
			case "playoff": playoff = "Title Play-off"; break;
		}
		standingNotes.append( $("<A></A>").addClass("badge").addClass("badge-titleCount").addClass("playoff").html( playoff ).attr("href","#").on("click",function(e){e.preventDefault();$("#"+standing.playoff+"-tab").click();}) );
		keys = keys.replace("|standings.playoff|","|").replace("||","|");
	}

	standingRow.append(standingPlace).append(standingTeam).append(standingP).append(standingW).append(standingD).append(standingL).append(standingF).append(standingA).append(standingPts).append(standingGd).append(standingNotes);

	$("#standingsTable tbody").append(standingRow);

	// not shown
	keys = keys.replace("|standings.season|","|").replace("||","|");
	keys = keys.replace("|standings.level|","|").replace("||","|");	
	keys = keys.replace("|standings.league|","|").replace("||","|");
	keys = keys.replace("|standings.series|","|").replace("||","|");
}