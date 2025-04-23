resultNotes = [];

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
		if ( resultNotes.length !== 0 ) {
			noteWrapper = $("<UL></UL>").addClass("list-group").addClass("match-notes");
			resultNotes.forEach(note=>{
				thisNote = $("<LI></LI>").addClass("list-group-item");
				theNoteText = note.home + " v " + note.away + ": "
				if ( note.forfeit ) {
					theNoteText += "Awarded to WINNER by forfeit";
				} else if ( note.note ) {
					theNoteText += note.note;
				}
				theNoteText = theNoteText.replaceAll(note.home,allTeams[note.home]);
				theNoteText = theNoteText.replaceAll(note.away,allTeams[note.away]);
				scoreParts = note.score.split("-");
				if ( scoreParts[0] > scoreParts[1] ) {
					theNoteText = theNoteText.replaceAll("WINNER",allTeams[note.home]);
				} else if ( scoreParts[0] < scoreParts[1] ) {
					theNoteText = theNoteText.replaceAll("WINNER",allTeams[note.away]);
				}
				thisNote.html(theNoteText);
				noteWrapper.append(thisNote);
			});
			matchesPanel.append(noteWrapper);
		}
		$("#leagueTabContent").append(matchesPanel);
		removeKey("teams");
		removeKey("matches");
	}
	if ( league.series ) {
		league.series.forEach(series=>{
			seriesKeys = Object.keys(series);
			for ( i=0 ; i!==seriesKeys.length ; i++ ) {
				seriesKeys[i] = "series." + seriesKeys[i];
			}
			addKeys(seriesKeys);
			$("#leagueTabs").append(buildTabButton("series_"+series.series,series.name,series.series===1,series.missing));
			seriesPanel = buildTabPanel("series_"+series.series,series.series===1);
			seriesPanel.addClass("tab-pane__standings");
			if ( ! series.missing ) {
				seriesPanel.append( buildStandings(series.standings,league.pts_win?league.pts_win:3) );
				removeKey("series.standings");
			} else {
				seriesPanel.append(
					$("<DIV></DIV>").addClass("alert").addClass("alert-danger").html("Unable to load series")
				);
			}
			if ( series.note ) {
				seriesPanel.append(
					$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass("mt-5").html(
						series.note
					)
				);
				removeKey("series.note");
			}
			removeKey("pts_win");
			$("#leagueTabContent").append(seriesPanel);
			removeKey("series.series");
			removeKey("series.name");
			removeKey("series.missing");
			removeKey("series.teams");
		});
		removeKey("series");
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

		if ( league.playoffs.downup ) {
			$("#leagueTabs").append(buildTabButton("po_downup","Promotion/Relegation play-off"));
			poDownUp = buildTabPanel("po_downup");
			poDownUpMatches = $("<DIV></DIV>").addClass("list-group");
			league.playoffs.downup.forEach(m=>{
				poDownUpMatches.append( drawMatch(m,true));
			});
			poDownUp.append(poDownUpMatches);
			$("#leagueTabContent").append(poDownUp);
			removeKey("playoffs.downup");
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
					
					matchKeys = Object.keys(theMatch[0]);
					for ( i=0 ; i!==matchKeys.length ; i++ ) {
						matchKeys[i] = "match." + matchKeys[i];
					}
					addKeys(matchKeys);

					scoreParts = theMatch[0].score.split("-");
					result = "";
					if ( scoreParts[0] > scoreParts[1] ) {
						result = "homeWin"
					} else if ( scoreParts[0] < scoreParts[1] ) {
						result = "awayWin";
					} else if ( scoreParts[0] === scoreParts[1] ) {
						result = "draw";
					}

					if ( theMatch[0].forfeit ) {
						abbr = $("<ABBR></ABBR>").attr("title","Match awarded by forfeit").html(theMatch[0].score);
						teamRow.append( $("<TD></TD>").addClass(result).append(abbr) );
						resultNotes.push(theMatch[0]);
						removeKey("match.forfeit");
					} else if ( theMatch[0].note ) {
						abbr = $("<ABBR></ABBR>").attr("title",theMatch[0].note).html(theMatch[0].score);
						teamRow.append( $("<TD></TD>").addClass(result).append(abbr) );
						resultNotes.push(theMatch[0]);
						removeKey("match.note");
					} else {
						teamRow.append( $("<TD></TD>").html(theMatch[0].score).addClass(result) );
					}

					removeKey("match.score");
					removeKey("match.home");
					removeKey("match.away");
					removeKey("match.season");
					removeKey("match.competition");
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

		teamName = allTeams[s.team];
		if ( ! teamName ) {
			teamNameParts = s.team.split(":");
			if ( teamNameParts.length === 2 ) {
				teamName = allTeams[teamNameParts[0]] + " ";
				switch ( teamNameParts[1] ) {
					case "2":
						teamName += "II";
						break;
					default:
						teamName += teamNameParts[1];
				}
			} else {
				teamName = "<span class='text-bg-danger'>"+s.team+"</span>";
			}
		}

		thisRow
			.append( $("<TD></TD>").html(s.place) )
			.append( $("<TH></TH>").attr("scope","row").html(teamName) )
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
	
		if ( s.promoted ) {
			thisRow.addClass("is-promoted");
			removeKey("standings.promoted");
			removeKey("series.promoted");
			if ( s.target ) {
				
				targetKeys = Object.keys(s.promoted);
				for ( i=0 ; i!==targetKeys.length ; i++ ) {
					targetKeys[i] = "standings.target." + targetKeys[i];
				}
				addKeys(targetKeys);
				removeKey("standings.target");

				if ( ! s.playoff ) {
					thisRowNotes.append(
						$("<A></A>")
							.html(["Promoted to",s.target.season,s.target.name].join(" "))
							.attr("href","league.html?season="+s.target.season+"&level="+s.target.level)
					);
				}
				removeKey("standings.target.season");
				removeKey("standings.target.level");
				removeKey("standings.target.name");
			}
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
	
		if ( s.removed ) {
			thisRow.addClass("is-removed");
			removeKey("standings.removed");
			
			thisRowNotes.append(
				$("<ABBR></ABBR>")
					.attr("title",s.removed_note)
					.html("Removed")
			);
			removeKey("standings.removed");
			removeKey("standings.removed_note");
		}

		if ( s.title_count ) {
			thisRowNotes.append( $("<SPAN></SPAN>").html( getTitleCount(s.title_count)) );
			removeKey("standings.title_count");
		}
		if ( s.playoff ) {
			if ( ["relegation","downup"].indexOf(s.playoff) !== -1 ) {
				theText = "";
				switch ( s.playoff ) {
					case "relegation": theText = "Relegation"; break;
					case "downup":     theText = "Promotion/Relegation"; break;
				}
				thisRowNotes.append( $("<SPAN></SPAN>").addClass("faux-link").html(theText+" play-off").on("click",function(){$("#po_"+s.playoff+"-tab").click();}) );
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
		removeKey("standings.series");
		removeKey("standings.league");

		tbody.append(thisRow);
	});

	tbl.append(thead).append(tbody);

	return tbl;
}