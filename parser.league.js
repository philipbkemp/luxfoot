season = null;
teams = null;

$(document).ready(function(){
	
	queryParams = {};
	window.location.search.replace("?","").split("&").forEach(searchObject=>{
		so = searchObject.split("=");
		queryParams[so[0]] = so[1];
	});

	if ( queryParams.level && queryParams.season ) {
		getSeasonData();
	}

});

function getSeasonData() {
	$.ajax({url: "seasons/"+queryParams.season+"/mens_league_"+queryParams.level+".json", success: function(result){
		season = result;
		getTeams();
	}});
}

function getTeams() {
	$.ajax({url: "data/teams.json", success: function(result){
		teams = result;
		displayLeague();
	}});
}

function displayLeague() {
	keys = "|" + Object.keys(season).join("|") + "|";

	// page title
	$("head title").text(season.division + " | " + season.season + " | LuxFoot");

	// header
	$("h1").text(season.division + " / " + season.season);

	keys = keys.replace("|season|","|");
	keys = keys.replace("|division|","|");

	// league table
	standing = 0;
	season.standings.forEach(r=>{
		standing++;
		standingRow = $("<TR></TR>");
		pos = $("<TD></TD>").text(standing);
		team = $("<TH></TH>").attr("scope","row").text( season.teams[r.club] );
		played = $("<TD></TD>").text( r.w + r.d + r.l );
		won = $("<TD></TD>").text(r.w);
		drawn = $("<TD></TD>").text(r.d);
		lost = $("<TD></TD>").text(r.l);
		gFor = $("<TD></TD>").text(r.f);
		gAgainst = $("<TD></TD>").text(r.a);
		gDiff = $("<TD></TD>").text(r.f - r.a);
		pts = $("<TD></TD>").text( (r.w*3) + r.d );
		notes = $("<TD></TD>");
		if ( season.champion === r.club ) {
			standingRow.addClass("champion");
			notes.append( $("<IMG/>").attr("src","assets/trophy.png").attr("alt","Champion").attr("title","Champion") );
		}
		if ( season.relegated.includes(r.club) ) {
			standingRow.addClass("relegated");
			notes.append( $("<IMG/>").attr("src","assets/relegated.png").attr("alt","Relegated to "+season.relegation_target).attr("title","Relegated to "+season.relegation_target) );
		} else if ( season.relegation_playoffs.includes(r.club) ) {
			standingRow.addClass("relegation-playoff");
		}
		standingRow.append(pos).append(team).append(played).append(won).append(drawn).append(lost).append(gFor).append(gAgainst).append(gDiff).append(pts).append(notes);
		$("#league_table tbody").append(standingRow);
	});
	keys = keys.replace("|champion|","|");
	keys = keys.replace("|relegated|","|");
	keys = keys.replace("|relegation_target|","|");
	keys = keys.replace("|relegation_playoffs|","|");
	keys = keys.replace("|standings|","|");

	/* results table */
	Object.keys(season.teams).forEach(k=>{
		$("#results_table thead tr").append( $("<TH></TH>").attr("scope","col").text(k) );
	});
	Object.keys(season.teams).forEach(k=>{
		resRow = $("<TR></TR>");
		resRow.append( $("<TH></TH>").attr("scope","row").text( season.teams[k] ) );
		Object.keys(season.teams).forEach(kk=>{
			if ( k !== kk ) {
				matchKey = k + "_" + kk;
				result = season.matches.filter(item => !!item[matchKey])[0][matchKey];
				resParts = result.split("-");
				res = "draw";
				if ( resParts[0] > resParts[1] ) {
					res = "home-win";
				} else if ( resParts[1] > resParts[0] ) {
					res = "away-win";
				}
				resRow.append( $("<TD></TD>").text(result).addClass(res) );
			} else {
				resRow.append( $("<TD></TD>").text("-") );
			}
		});
		$("#results_table tbody").append( resRow );
	});
	keys = keys.replace("|matches|","|");

	if ( season.relegation_playoff_matches ) {
		$("#relegation_playoffs").addClass("d-later");
		season.relegation_playoff_matches.forEach(m=>{
			matchRow = $("<DIV></DIV>").addClass("row").addClass("mt-3");
			rpTeams = Object.keys(m)[0].split("_");
			homeTeam = season.teams[rpTeams[0]] ?? teams[rpTeams[0]];
			awayTeam = season.teams[rpTeams[1]] ?? teams[rpTeams[1]];
			scoreParts = m[Object.keys(m)[0]].split("|");
			ftScore = scoreParts[0];
			outcome = "";
			if ( ftScore.split("-")[0] > ftScore.split("-")[1] ) {
				if ( season.teams[rpTeams[0]] ) {
					outcome = homeTeam + " remain in " + season.division;
				} else {
					outcome = homeTeam + " relegated to " + season.relegation_target;
				}
			} else if ( ftScore.split("-")[0] < ftScore.split("-")[1] ) {
				if ( season.teams[rpTeams[1]] ) {
					outcome = homeTeam + " remain in " + season.division;
				} else {
					outcome = homeTeam + " relegated to " + season.relegation_target;
				}
			}
			if ( scoreParts.length === 2 ) {
				// aet
				ftScore += "<br />(a.e.t)";
			} else if ( scoreParts.length === 3 ) {
				// aet + pens
				ftScore += "<br />(after extra time)";
				ftScore += "<br />Penalties:<br />"+scoreParts[2];
				if ( scoreParts[2].split("-")[0] > scoreParts[2].split("-")[1] ) {
					if ( season.teams[rpTeams[0]] ) {
						outcome = homeTeam + " remain in " + season.division;
					} else {
						outcome = homeTeam + " relegated to " + season.relegation_target;
					}
				} else if ( scoreParts[2].split("-")[0] < scoreParts[2].split("-")[1] ) {
					if ( season.teams[rpTeams[1]] ) {
						outcome = homeTeam + " remain in " + season.division;
					} else {
						outcome = homeTeam + " relegated to " + season.relegation_target;
					}
				}
			}
			home = $("<DIV></DIV>").addClass("col-5").addClass("text-end").text(homeTeam);
			score = $("<DIV></DIV>").addClass("col-2").addClass("text-center").html(ftScore);
			away = $("<DIV></DIV>").addClass("col-5").addClass("text-start").text(awayTeam);
			rpOutcome = $("<DIV></DIV>").addClass("col-12").addClass("text-center").addClass("fst-italic").addClass("small").text(outcome);
			matchRow.append(home).append(score).append(away).append(rpOutcome);
			$("#rp_matches").append(matchRow);
		});
	}
	keys = keys.replace("|relegation_playoff_matches|","|");

	keys = keys.replace("|teams|","|");

	if ( keys !== "|" ) {
		console.error(keys);
	}

	// remove placeholders
	$(".placeholder-glow").removeClass("placeholder-glow");
	$(".placeholder").removeClass("placeholder");
	$(".d-none.d-later").removeClass("d-none").removeClass("d-later");
}