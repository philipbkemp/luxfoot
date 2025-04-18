$(document).ready(function(){

	if ( checkParams(["season","level"]) ) {
	
		$.ajax({
			url: "data/teams.json",
			success: function(data) {
				parseTeams(data);
			}
		});

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

function buildTabButton(code,label,active=false) {
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

function parseLeague(league) {
	addKeys(Object.keys(league));

	setTitles(league.season,league.name);
    removeKey("season");
	removeKey("name");

	if ( league.standings ) {
		$("#leagueTabs").append(buildTabButton("standings","Standings",true));
		standingsPanel = buildTabPanel("standings",true);
		standingsPanel.append( buildStandings(league.standings,league.pts_win?league.pts_win:3) );
		if ( league.pts_win && league.pts_win !== 3) {
			standingsPanel.append(
				$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass("mt-5").html(
					league.pts_win + " points for a win"
				)
			);
			removeKey("pts_win");
		}
		$("#leagueTabContent").append(standingsPanel);
		removeKey("standings");
	}
	if ( league.matches ) {
		$("#leagueTabs").append(buildTabButton("matches","Results Table"));
		matchesPanel = buildTabPanel("matches");
		matchesPanel.append( buildResultsTable(league.teams,league.matches) );
		matchesPanel.append(
			$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass("d-inline-block").html(
				"<strong>Legend:</strong> <span class='homeWin'></span>Home win <span class='awayWin'></span>Away win <span class='draw'></span>Draw"
			)
		);
		$("#leagueTabContent").append(matchesPanel);
		removeKey("teams");
		removeKey("matches");
	}
	if ( league.playoffs ) {
		subKeys = Object.keys(league.playoffs);
		for ( i=0 ; i!==subKeys.length ; i++ ) {
			subKeys[i] = "playoffs." + subKeys[i];
		}
		addKeys(subKeys);

		if ( league.playoffs.relegation ) {
			$("#leagueTabs").append(buildTabButton("po_relegation","Relegation play-off"));
			poRelegation = buildTabPanel("po_relegation");
			poRelegationMatches = $("<DIV></DIV>").addClass("list-group");
			league.playoffs.relegation.forEach(m=>{
				poRelegationMatches.append( drawMatch(m,true));
			});
			poRelegation.append(poRelegationMatches);
			$("#leagueTabContent").append(poRelegation);
			removeKey("playoffs.relegation");
		}

		removeKey("playoffs");
	}

	
	$("#menu-links").append(
		$("<LI></LI>").append(
			$("<A></A>").addClass("p-2").attr("href","season.html?season="+league.season).html("Season overview")
		)
	);
	if ( league.links ) {
		linkKeys = Object.keys(league.links);
		for ( i=0 ; i!==linkKeys.length ; i++ ) {
			linkKeys[i] = "links." + linkKeys[i];
		}
		addKeys(linkKeys);
		if ( league.links.next ) {
			$("#menu-links").append(
				$("<LI></LI>").append(
					$("<A></A>").addClass("p-2").attr("href","league.html?season="+league.links.next+"&level="+league.level).html("Next season")
				)
			);
			removeKey("links.next");
		}
		if ( league.links.prev ) {
			$("#menu-links").append(
				$("<LI></LI>").append(
					$("<A></A>").addClass("p-2").attr("href","league.html?season="+league.links.prev+"&level="+league.level).html("Previous season")
				)
			);
			removeKey("links.prev");
		}
		if ( league.links.down ) {
			$("#menu-links").append(
				$("<LI></LI>").append(
					$("<A></A>").addClass("p-2").attr("href","league.html?season="+league.season+"&level="+league.links.down).html("Down a level")
				)
			);
			removeKey("links.down");
		}
		removeKey("links");
	}

	removeKey("level");
	removeKey("champion");
	removeKey("relegation");

	if ( keys.length !== 0 ) {
		console.log(league);
		console.log(keys);
	}

	$(".placeholder-glow").addClass("d-none");
	$(".displayAfterLoad").removeClass("d-none");
}

function buildResultsTable(teams,results) {
	tbl = $("<TABLE></TABLE>").addClass("table").addClass("table-sm").addClass("table-hover");
	tblBody = $("<TBODY></TBODY>");

	topRow = $("<TR></TR>").addClass("top-row");
	topRow.append( $("<TD></TD>").html("") );
	teams.forEach(t=>{
		topRow.append( $("<TH></TH>").attr("scope","col").html("<abbr title='"+allTeams[t]+"'>"+t+"</abbr>") );
	});
	tblBody.append(topRow);

	teams.forEach(t=>{
		teamRow = $("<TR></TR>");
		teamRow.append( $("<TH></TH>").attr("scope","row").html( allTeams[t] ) );
		teams.forEach(tt=>{
			if ( tt === t ) {
				teamRow.append( $("<TD></TD>").html("").addClass("noMatch") );
			} else {
				theMatch = results.filter(m=>{return m.home===t && m.away===tt;});
				if ( theMatch.length === 1 ) {
					scoreParts = theMatch[0].score.split("-");
					result = "";
					if ( scoreParts[0] > scoreParts[1] ) {
						result = "homeWin"
					} else if ( scoreParts[0] < scoreParts[1] ) {
						result = "awayWin";
					} else if ( scoreParts[0] === scoreParts[1] ) {
						result = "draw";
					}
					teamRow.append( $("<TD></TD>").html(theMatch[0].score).addClass(result) );
				} else {
					teamRow.append( $("<TD></TD>").html("--").addClass("noMatch") );
					console.error(t,tt,theMatch);
				}
			}
		});
		tblBody.append(teamRow);
	});

	tbl.append(tblBody);	
	return tbl;
}

function buildStandings(standings,ptsWin=3) {
	tbl = $("<TABLE></TABLE>").addClass("table").addClass("table-sm").addClass("table-hover");

	thead = $("<THEAD></THEAD>");
	theadRow = $("<TR></TR>");
	theadRow
		.append( $("<TH></TH>").attr("scope","col").html("") )
		.append( $("<TH></TH>").attr("scope","col").html("Team") )
		.append( $("<TH></TH>").attr("scope","col").html("<abbr title='Played'>P</abbr>") )
		.append( $("<TH></TH>").attr("scope","col").html("<abbr title='Won'>W</abbr>") )
		.append( $("<TH></TH>").attr("scope","col").html("<abbr title='Drawn'>D</abbr>") )
		.append( $("<TH></TH>").attr("scope","col").html("<abbr title='Lost'>L</abbr>") )
		.append( $("<TH></TH>").attr("scope","col").html("<abbr title='Goals For'>F</abbr>") )
		.append( $("<TH></TH>").attr("scope","col").html("<abbr title='Goals Against'>A</abbr>") )
		.append( $("<TH></TH>").attr("scope","col").html("<abbr title='Points'>Pts</abbr>") )		
		.append( $("<TH></TH>").attr("scope","col").html("<abbr title='Goal Difference'>GD</abbr>") )
		.append( $("<TH></TH>").attr("scope","col").html("") )
		;
	thead.append(theadRow);

	tbody = $("<TBODY></TBODY>");

	standings.forEach(s=>{
		subKeys = Object.keys(s);
		for ( i=0 ; i!==subKeys.length ; i++ ) {
			subKeys[i] = "standings." + subKeys[i];
		}
		addKeys(subKeys);

		thisRow = $("<TR></TR>");
		thisRowNotes = $("<TD></TD>");

		thisRow
			.append( $("<TD></TD>").html(s.place) )
			.append( $("<TH></TH>").attr("scope","row").html(allTeams[s.team]) )
			.append( $("<TD></TD>").html(s.w+s.d+s.l) )
			.append( $("<TD></TD>").html(s.w) )
			.append( $("<TD></TD>").html(s.d) )
			.append( $("<TD></TD>").html(s.l) )
			.append( $("<TD></TD>").html(s.f) )
			.append( $("<TD></TD>").html(s.a) )
			.append( $("<TD></TD>").html((s.w*ptsWin)+s.d) )
			.append( $("<TD></TD>").html(s.f-s.a) )
			;
		
		if ( s.champion ) {
			thisRow.addClass("is-champion");
			removeKey("standings.champion");
		}
	
		if ( s.relegated ) {
			thisRow.addClass("is-relegated");
			removeKey("standings.relegated");
			if ( s.target ) {
				
				targetKeys = Object.keys(s.relegated);
				for ( i=0 ; i!==targetKeys.length ; i++ ) {
					targetKeys[i] = "standings.target." + targetKeys[i];
				}
				addKeys(targetKeys);
				removeKey("standings.target");

				if ( ! s.playoff ) {
					thisRowNotes.append(
						$("<A></A>")
							.html(["Relegated to",s.target.season,s.target.name].join(" "))
							.attr("href","league.html?season="+s.target.season+"&level="+s.target.level)
					);
				}
				removeKey("standings.target.season");
				removeKey("standings.target.level");
				removeKey("standings.target.name");
			}
		}

		if ( s.title_count ) {
			thisRowNotes.append( $("<SPAN></SPAN>").html( getTitleCount(s.title_count)) );
			removeKey("standings.title_count");
		}
		if ( s.playoff ) {
			if ( ["relegation"].indexOf(s.playoff) !== -1 ) {
				thisRowNotes.append( $("<SPAN></SPAN>").addClass("faux-link").html("Relegation play-off").on("click",function(){$("#po_"+s.playoff+"-tab").click();}) );
				thisRow.addClass("is-playoff_"+s.playoff);
				removeKey("standings.playoff");
			}
		}

		thisRow.append(thisRowNotes);

		removeKey("standings.place");
		removeKey("standings.team");
		removeKey("standings.w");
		removeKey("standings.d");
		removeKey("standings.l");
		removeKey("standings.f");
		removeKey("standings.a");
		removeKey("standings.pts_win");

		removeKey("standings.season");
		removeKey("standings.level");		
		removeKey("standings.league");

		tbody.append(thisRow);
	});

	tbl.append(thead).append(tbody);

	return tbl;
}