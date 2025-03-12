function buildMatch(m,cup=false) {
	matchRow = $("<DIV></DIV>").addClass("row").addClass("mt-3");
	rpTeams = Object.keys(m)[0].split("_");
	if ( ! cup ) {
		homeTeam = season.teams[rpTeams[0]] ?? teams[rpTeams[0]];
		awayTeam = season.teams[rpTeams[1]] ?? teams[rpTeams[1]];
	} else {
		rpHomeTeam = rpTeams[0].split(".");
		rpAwayTeam = rpTeams[1].split(".");
		homeTeam = teams[rpHomeTeam[0]];
		awayTeam = teams[rpAwayTeam[0]];
		// todo: abbreviation to show what it means = N:National Division / H:Division of Honour / etc.
		homeTeam += " ("+rpHomeTeam[1]+")";
		awayTeam += " ("+rpAwayTeam[1]+")";
	}
	ftScore = m[Object.keys(m)[0]];
	winner = ftScore.split("-")[0] > ftScore.split("-")[1] ? "home": "away";
	if ( m.aet ) {
		ftScore += "<br />(a.e.t)";
	}
	if ( m.pens ) {
		ftScore += "<br />Penalties: " + m.pens;
		winner = m.pens.split("-")[0] > m.pens.split("-")[1] ? "home": "away";
	}
	home = $("<DIV></DIV>").addClass("col-5").addClass("text-end").text(homeTeam);
	score = $("<DIV></DIV>").addClass("col-2").addClass("text-center").html(ftScore);
	away = $("<DIV></DIV>").addClass("col-5").addClass("text-start").text(awayTeam);
	if ( cup ) {
		if ( winner === "home" ) {
			home.addClass("fw-bold");
		} else {
			away.addClass("fw-bold");
		}
	}
	matchRow.append(home).append(score).append(away);
	return matchRow;
}