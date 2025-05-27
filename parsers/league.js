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
		url: "seasons/"+seasonPath(urlParams.season)+"/level_"+level+".json",
		success: function(data) {
			parseLeague(data);
		},
		error: function(data) {
			invalid();
		}
	})
}

function parseLeague(league) {
	addKeys(Object.keys(league));

	validateLeague(league);

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
		removeKey("matches");
	}
	if ( league.series ) {

		po_downup = po_updown = po_updownLeague = null;

		league.series.forEach(series=>{
			seriesKeys = Object.keys(series);
			for ( i=0 ; i!==seriesKeys.length ; i++ ) {
				seriesKeys[i] = "series." + seriesKeys[i];
			}
			addKeys(seriesKeys);
			$("#leagueTabs").append(buildTabButton("series_"+series.series,series.name,series.series===1,series.missing,league.shortTabs?true:false));
			seriesPanel = buildTabPanel("series_"+series.series,series.series===1);
			seriesPanel.addClass("tab-pane__standings");
			if ( league.in_progress ) {
				seriesPanel.append(
					$("<DIV></DIV>").addClass("alert").addClass("alert-info").html(
						"League is still running"
					)
				);
				removeKey("in_progress");
				removeKey("series.in_progress");
			}
			if ( ! series.missing ) {
				seriesPanel.append( buildStandings(series.standings,league.pts_win?league.pts_win:3) );
				if ( league.pts_win && league.pts_win !== 3) {
					seriesPanel.append(
						$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass("mt-5").html(
							league.pts_win + " points for a win"
						)
					);
					removeKey("pts_win");
				}
				if ( series.note ) {
					seriesPanel.append(
						$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass("mt-5").html(
							series.note
						)
					);
					removeKey("series.note");
				}
				removeKey("series.standings");
				if ( series.matches ) {
					seriesPanel.append( $("<H2></H2>").html("Results table").addClass("pt-3") );
					hasTwo = false || (series.play_each && series.play_each === 3);
					if ( ! hasTwo ) {
						seriesPanel.append( buildResultsTable(series.teams,series.matches) );
					} else {
						resultsPanels = buildResultsTable(series.teams,series.matches,hasTwo);
						seriesPanel.append( resultsPanels[0] );
						seriesPanel.append( resultsPanels[1] );
					}
					seriesPanel.append(
						$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass("d-inline-block").html(
							"<strong>Legend:</strong> <span class='homeWin'></span>Home win <span class='awayWin'></span>Away win <span class='draw'></span>Draw"
						)
					);
					removeKey("series.matches");
					removeKey("series.play_each");
				}

				if ( series.playoffs ) {
					subKeys = Object.keys(series.playoffs);
					for ( i=0 ; i!==subKeys.length ; i++ ) {
						subKeys[i] = "series.playoffs." + subKeys[i];
					}
					addKeys(subKeys);

					if ( series.playoffs.downup ) {
						$("#leagueTabs").append(buildTabButton("po_downup","Relegation play-off"));
						if ( ! po_downup ) {
							po_downup = buildTabPanel("po_downup");
						}
						po_downup_matches = $("<DIV></DIV>").addClass("list-group");
						series.playoffs.downup.forEach(m=>{
							po_downup_matches.append( drawMatch(m,true));
						});
						po_downup.append(po_downup_matches);
						removeKey("series.playoffs.downup");
					}
					if ( series.playoffs.updown ) {
						$("#leagueTabs").append(buildTabButton("po_updown","Promotion play-off"));
						if ( ! po_updown ) {
							po_updown = buildTabPanel("po_updown");
						}
						po_updown_matches = $("<DIV></DIV>").addClass("list-group");
						series.playoffs.updown.forEach(m=>{
							po_updown_matches.append( drawMatch(m,true));
						});
						po_updown.append(po_updown_matches);
						removeKey("series.playoffs.updown");
					}
					if ( series.playoffs.updown_league ) {
						$("#leagueTabs").append(buildTabButton("po_updown_league","Promotion play-off"));
						if ( ! po_updownLeague ) {
							po_updownLeague = buildTabPanel("po_updown_league");
						}
						po_updownLeague.append( buildStandings(series.playoffs.updown_league) );
						removeKey("series.playoffs.updown_league");
					}

					removeKey("series.playoffs");
				}

			} else {
				seriesPanel.append(
					$("<DIV></DIV>").addClass("alert").addClass("alert-danger").html("Unable to load series")
				);
			}
			removeKey("pts_win");
			$("#leagueTabContent").append(seriesPanel);
			removeKey("series.series");
			removeKey("series.name");
			removeKey("series.missing");
			removeKey("series.teams");
			removeKey("shortTabs");
		});

		if ( po_downup ) {
			$("#leagueTabContent").append(po_downup);
		}
		if ( po_updown ) {
			$("#leagueTabContent").append(po_updown);
		}
		if ( po_updownLeague ) {
			$("#leagueTabContent").append(po_updownLeague);
		}

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

		if ( league.playoffs.promotion ) {
			$("#leagueTabs").append(buildTabButton("po_promotion","Promotion play-off"));
			poPromotion = buildTabPanel("po_promotion");
			poPromotionMatches = $("<DIV></DIV>").addClass("list-group");
			league.playoffs.promotion.forEach(m=>{
				poPromotionMatches.append( drawMatch(m,true));
			});
			poPromotion.append(poPromotionMatches);
			$("#leagueTabContent").append(poPromotion);
			removeKey("playoffs.promotion");
		}

		if ( league.playoffs.downup ) {
			$("#leagueTabs").append(buildTabButton("po_downup","Relegation play-off"));
			poDownUp = buildTabPanel("po_downup");
			poDownUpMatches = $("<DIV></DIV>").addClass("list-group");
			league.playoffs.downup.forEach(m=>{
				poDownUpMatches.append( drawMatch(m,true));
			});
			poDownUp.append(poDownUpMatches);
			$("#leagueTabContent").append(poDownUp);
			removeKey("playoffs.downup");
		}

		if ( league.playoffs.updown ) {
			$("#leagueTabs").append(buildTabButton("po_updown","Promotion play-off"));
			poUpDown = buildTabPanel("po_updown");
			poUpDownMatches = $("<DIV></DIV>").addClass("list-group");
			league.playoffs.updown.forEach(m=>{
				poUpDownMatches.append( drawMatch(m,true));
			});
			poUpDown.append(poUpDownMatches);
			$("#leagueTabContent").append(poUpDown);
			removeKey("playoffs.updown");
		}

		if ( league.playoffs.league_promotion_playoff ) {
			$("#leagueTabs").append(buildTabButton("po_league_promotionplayoff","Promotion play-off"));
			poLeaguePromotionPlayoff = buildTabPanel("po_league_promotionplayoff");
			poLeaguePromotionPlayoffMatches = $("<DIV></DIV>").addClass("list-group").addClass("mb-4");
			league.playoffs.league_promotion_playoff.matches.forEach(m=>{
				poLeaguePromotionPlayoffMatches.append( drawMatch(m));
			});
			poLeaguePromotionPlayoff.append(poLeaguePromotionPlayoffMatches);
			poLeaguePromotionPlayoff.append(
				buildStandings(
					league.playoffs.league_promotion_playoff.standings,
					league.playoffs.league_promotion_playoff.pts_win
						? league.playoffs.league_promotion_playoff.pts_win
						: 3
				)
			);
			$("#leagueTabContent").append(poLeaguePromotionPlayoff);
			removeKey("playoffs.league_promotion_playoff");
		}

		if ( league.playoffs.league_promotion_playoff_a ) {
			$("#leagueTabs").append(buildTabButton("po_league_promotion_playoff_a","Play-off (2)"));
			poLeaguePromotionPlayoff = buildTabPanel("po_league_promotion_playoff_a");
			poLeaguePromotionPlayoffMatches = $("<DIV></DIV>").addClass("list-group").addClass("mb-4");
			if ( league.playoffs.league_promotion_playoff_a.matches ) {
				league.playoffs.league_promotion_playoff.matches.forEach(m=>{
					poLeaguePromotionPlayoffMatches.append( drawMatch(m));
				});
				poLeaguePromotionPlayoff.append(poLeaguePromotionPlayoffMatches);
			}
			poLeaguePromotionPlayoff.append(
				buildStandings(
					league.playoffs.league_promotion_playoff_a.standings,
					league.playoffs.league_promotion_playoff_a.pts_win
						? league.playoffs.league_promotion_playoff_a.pts_win
						: 3
				)
			);
			$("#leagueTabContent").append(poLeaguePromotionPlayoff);
			removeKey("playoffs.league_promotion_playoff_a");
		}

		if ( league.playoffs.league_promotion_playoff_b ) {
			$("#leagueTabs").append(buildTabButton("po_league_promotion_playoff_b","Play-off (2)"));
			poLeaguePromotionPlayoff = buildTabPanel("po_league_promotion_playoff_b");
			if ( league.playoffs.league_promotion_playoff_b.matches ) {
				poLeaguePromotionPlayoffMatches = $("<DIV></DIV>").addClass("list-group").addClass("mb-4");
				league.playoffs.league_promotion_playoff.matches.forEach(m=>{
					poLeaguePromotionPlayoffMatches.append( drawMatch(m));
				});
				poLeaguePromotionPlayoff.append(poLeaguePromotionPlayoffMatches);
			}
			poLeaguePromotionPlayoff.append(
				buildStandings(
					league.playoffs.league_promotion_playoff_b.standings,
					league.playoffs.league_promotion_playoff_b.pts_win
						? league.playoffs.league_promotion_playoff_b.pts_win
						: 3
				)
			);
			$("#leagueTabContent").append(poLeaguePromotionPlayoff);
			if ( league.playoffs.league_promotion_playoff_b.decider ) {
				poLeaguePromotionPlayoffMatchesDecider = $("<DIV></DIV>").addClass("list-group").addClass("mb-4");
				league.playoffs.league_promotion_playoff_b.decider.forEach(m=>{
					poLeaguePromotionPlayoffMatchesDecider.append( drawMatch(m));
				});
				poLeaguePromotionPlayoff.append(poLeaguePromotionPlayoffMatchesDecider);
			}
			removeKey("playoffs.league_promotion_playoff_b");
		}

		if ( league.playoffs.playoff ) {
			$("#leagueTabs").append(buildTabButton("po_playoff","Playoffs"));
			poPlayoff = buildTabPanel("po_playoff");
			poPlayoffMatches = $("<DIV></DIV>").addClass("list-group");
			league.playoffs.playoff.forEach(m=>{
				poPlayoffMatches.append( drawMatch(m,true));
			});
			poPlayoff.append(poPlayoffMatches);
			$("#leagueTabContent").append(poPlayoff);
			removeKey("playoffs.playoff");
		}

		if ( league.playoffs.title ) {
			$("#leagueTabs").append(buildTabButton("po_title","Title Decider"));
			poTitle = buildTabPanel("po_title");
			poTitleMatches = $("<DIV></DIV>").addClass("list-group");
			league.playoffs.title.forEach(m=>{
				poTitleMatches.append( drawMatch(m,true));
			});
			poTitle.append(poTitleMatches);
			$("#leagueTabContent").append(poTitle);
			removeKey("playoffs.title");
		}

		if ( league.playoffs.updown_league_multi ) {
			$("#leagueTabs").append(buildTabButton("po_updown_league_multi","Promotion Play-offs"));
			poLeagueUpDown = buildTabPanel("po_updown_league_multi");
			league.playoffs.updown_league_multi.forEach(po=>{
				poLeagueUpDown.append(
					buildStandings(
						po,
						league.pts_win
							? league.pts_win
							: 3
					)
				);
				$("#leagueTabContent").append(poLeagueUpDown);
			});
			removeKey("playoffs.updown_league_multi");
		}		

		if ( league.playoffs.final_round ) {
			$("#leagueTabs").append(buildTabButton("po_final_round","Final Round"));
			poFinalRound = buildTabPanel("po_final_round");
			poFinalRoundMatches = $("<DIV></DIV>").addClass("list-group").addClass("mb-4");
			poFinalRound.append(
				buildStandings(
					league.playoffs.final_round.standings,
					league.playoffs.final_round.pts_win
						? league.playoffs.final_round.pts_win
						: 3
				)
			);
			hasNotes = false;
			if ( league.playoffs.final_round.note ) {
				poFinalRound.append(
					$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass(hasNotes?"mt-1":"mt-5").html(
						league.playoffs.final_round.note
					)
				);
				hasNotes = true;
			}
			if ( league.playoffs.final_round.pts_win && league.playoffs.final_round.pts_win !== 3 ) {
				poFinalRound.append(
					$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass(hasNotes?"mt-1":"mt-5").html(
						league.playoffs.final_round.pts_win + " points for a win"
					)
				);
				hasNotes = true;
			}
			poFinalRound.append( $("<H2></H2>").html("Results table") );
			poFinalRound.append( buildResultsTable(league.playoffs.final_round.teams, league.playoffs.final_round.matches) );
			$("#leagueTabContent").append(poFinalRound);
			removeKey("playoffs.final_round");
		}

		removeKey("playoffs");
	}
	if ( league.note ) {
		standingsPanel.append(
			$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass("mt-5").html(
				league.note
			)
		);
		removeKey("note");
	}
	if ( league.in_progress && ! league.series ) {
		standingsPanel.prepend(
			$("<DIV></DIV>").addClass("alert").addClass("alert-info").html(
				"League is still running"
			)
		);
		removeKey("in_progress");
	}

	
	$("#menu-links").append(
		$("<A></A>").attr("href","season.html?season="+league.season).html("Season").addClass("float-end")
	);
	if ( league.links ) {
		linkKeys = Object.keys(league.links);
		for ( i=0 ; i!==linkKeys.length ; i++ ) {
			linkKeys[i] = "links." + linkKeys[i];
		}
		addKeys(linkKeys);
		if ( league.links.down ) {
			$("#menu-links").append(
				$("<A></A>").attr("href","league.html?season="+league.season+"&level="+league.links.down).html("Down")
			);
			removeKey("links.down");
		}
		if ( league.links.prev ) {
			$("#menu-links").append(
				$("<A></A>").attr("href","league.html?season="+league.links.prev+"&level="+league.level).html("Previous")
			);
			removeKey("links.prev");
		}
		if ( league.links.next ) {
			$("#menu-links").append(
				$("<A></A>").attr("href","league.html?season="+league.links.next+"&level="+league.level).html("Next")
			);
			removeKey("links.next");
		}
		if ( league.links.up ) {
			$("#menu-links").append(
				$("<A></A>").attr("href","league.html?season="+league.season+"&level="+league.links.up).html("Up")
			);
			removeKey("links.up");
		}
		removeKey("links");
	}

	if ( league.in_progress && league.possible ) {
		$("#leagueTabs").append(buildTabButton("possible_finish","Possible Finishes"));
		possibleFinish = buildTabPanel("possible_finish");
		if ( ! league.series ) {
			possibleFinish.append( buildPossibleTable(league.standings,league.possible,league.teams.length,league.pts_win?league.pts_win:3,league.play_each?league.play_each:2) );
		} else {
			league.series.forEach(serie=>{
				possibleFinish.append( $("<H2></H2>").html(serie.name) );
				possibleFinish.append( buildPossibleTable(serie.standings,league.possible,serie.teams.length,league.pts_win?league.pts_win:3,league.play_each?league.play_each:2) );
			});
		}
		$("#leagueTabContent").append(possibleFinish);
		removeKey("possible");
		removeKey("play_each");
	}

	removeKey("level");
	removeKey("champion");
	removeKey("relegation");
	removeKey("promotion");
	removeKey("teams");

	if ( keys.length !== 0 ) {
		console.log(league);
		console.log(keys);
	}

	$(".placeholder-glow").addClass("d-none");
	$(".displayAfterLoad").removeClass("d-none");
}

function buildPossibleTable(standings,possible,teamCount,ptsWin=3,playEach=2) {
	tbl = $("<TABLE></TABLE>").addClass("table").addClass("table-sm").addClass("table-hover").addClass("table--standings");
	thead = $("<THEAD></THEAD>");
	theadRow = $("<TR></TR>");
	theadRow
		.append( $("<TH></TH>").attr("scope","col").html("") )
		.append( $("<TH></TH>").attr("scope","col").html("Team") )
		;
	for ( i=0 ; i!==teamCount ; i++ ) {
		theadRow.append( $("<TH></TH>").attr("scope","col").html(i+1) );
	}
	theadRow.append( $("<TH></TH>").attr("scope","col").html("") );
	thead.append(theadRow);

	pointsArray = [];
	gamesToPlay = (teamCount-1)*playEach;
	standings.forEach(s=>{
		pointsArray[s.place] = [
			(s.w*ptsWin) + s.d,
			(s.w*ptsWin) + s.d + ((gamesToPlay-s.w-s.d-s.l)*ptsWin)
		];
	});

	tbody = $("<TBODY></TBODY>");
	standings.forEach(s=>{
		thisRow = $("<TR></TR>");
		thisRowNotes = $("<TD></TD>");
		teamName = allTeams[s.team];
		
		thisRow
			.append( $("<TD></TD>").html(s.place) )
			.append( $("<TH></TH>").attr("scope","row").html(teamName) )
			;

		for ( i=0 ; i!==teamCount ; i++ ) {

			targetPlace = i+1;

			thisCell = $("<TD></TD>");

			if ( targetPlace === s.place ) {
				thisCell.addClass("possible-yes")
			} else if ( targetPlace > s.place ) {
				if ( pointsArray[targetPlace][1] >= pointsArray[s.place][0] ) {
					thisCell.addClass("possible-yes")
				}
			} else if ( targetPlace < s.place ) {
				if ( pointsArray[s.place][1] >= pointsArray[targetPlace][0] ) {
					thisCell.addClass("possible-yes")
				}
			}

			if ( possible.champion && possible.champion.includes(targetPlace) ) {
				thisCell.addClass("possible-champion");
			} else if ( possible.relegation && possible.relegation.includes(targetPlace) ) {
				thisCell.addClass("possible-relegation");
			} else if ( possible.playoff_downup && possible.playoff_downup.includes(targetPlace) ) {
				thisCell.addClass("possible-playoff_downup");
			} else if ( possible.promotion && possible.promotion.includes(targetPlace) ) {
				thisCell.addClass("possible-promotion");
			} else if ( possible.playoff_updown && possible.playoff_updown.includes(targetPlace) ) {
				thisCell.addClass("possible-playoff_updown");
			}			

			thisRow.append(thisCell);

		}
		thisRow.append(thisRowNotes);

		tbody.append(thisRow);
	});


	tbl.append(thead).append(tbody);

	return tbl;
}

function buildResultsTable(teams,results,hasTwo=false) {
	tbl = $("<TABLE></TABLE>").addClass("table").addClass("table-sm").addClass("table-hover").addClass("table--results");
	if ( hasTwo ) { tbl2 = $("<TABLE></TABLE>").addClass("table").addClass("table-sm").addClass("table-hover").addClass("table--results"); }
	tblBody = $("<TBODY></TBODY>");
	if ( hasTwo ) { tblBody2 = $("<TBODY></TBODY>"); }

	topRow = $("<TR></TR>").addClass("top-row");
	if ( hasTwo ) { topRow2 = $("<TR></TR>").addClass("top-row"); }
	topRow.append( $("<TD></TD>").html("") );
	if ( hasTwo ) { topRow2.append( $("<TD></TD>").html("") );}
	teams.forEach(t=>{
		topRow.append( $("<TH></TH>").attr("scope","col").html("<abbr title='"+allTeams[t]+"'>"+t+"</abbr>") );
		if ( hasTwo ) { topRow2.append( $("<TH></TH>").attr("scope","col").html("<abbr title='"+allTeams[t]+"'>"+t+"</abbr>") ); }
	});
	tblBody.append(topRow);
	if ( hasTwo ) { tblBody2.append(topRow2); }

	teams.forEach(t=>{
		teamRow = $("<TR></TR>");
		if ( hasTwo ) { teamRow2 = $("<TR></TR>"); }
		teamRow.append( $("<TH></TH>").attr("scope","row").html( allTeams[t] ) );
		if ( hasTwo ) { teamRow2.append( $("<TH></TH>").attr("scope","row").html( allTeams[t] ) ); }
		teams.forEach(tt=>{
			if ( tt === t ) {
				teamRow.append( $("<TD></TD>").html("").addClass("noMatch") );
				if ( hasTwo ) { teamRow2.append( $("<TD></TD>").html("").addClass("noMatch") ); }
			} else {
				theMatch = results.filter(m=>{return m.home===t && m.away===tt;});
				if ( theMatch.length >= 1 ) {
					
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
					} else if ( theMatch[0].score === "" ) {
						teamRow.append( $("<TD></TD>").html("-").addClass("opcaity-25").addClass(result) );
					} else {
						teamRow.append( $("<TD></TD>").html(theMatch[0].score).addClass(result) );
					}

					removeKey("match.score");
					removeKey("match.home");
					removeKey("match.away");
					removeKey("match.season");
					removeKey("match.competition");
					removeKey("match.date");
				} else {
					teamRow.append( $("<TD></TD>").html("--").addClass("noMatch") );
					console.error(t,tt,theMatch);
				}
				if ( theMatch.length === 2 ) {
					// second results table					
					matchKeys = Object.keys(theMatch[1]);
					for ( i=0 ; i!==matchKeys.length ; i++ ) {
						matchKeys[i] = "match." + matchKeys[i];
					}
					addKeys(matchKeys);

					scoreParts = theMatch[1].score.split("-");
					result = "";
					if ( scoreParts[0] > scoreParts[1] ) {
						result = "homeWin"
					} else if ( scoreParts[0] < scoreParts[1] ) {
						result = "awayWin";
					} else if ( scoreParts[0] === scoreParts[1] ) {
						result = "draw";
					}

					if ( theMatch[1].forfeit ) {
						abbr = $("<ABBR></ABBR>").attr("title","Match awarded by forfeit").html(theMatch[1].score);
						teamRow2.append( $("<TD></TD>").addClass(result).append(abbr) );
						resultNotes.push(theMatch[1]);
						removeKey("match.forfeit");
					} else if ( theMatch[1].note ) {
						abbr = $("<ABBR></ABBR>").attr("title",theMatch[1].note).html(theMatch[1].score);
						teamRow2.append( $("<TD></TD>").addClass(result).append(abbr) );
						resultNotes.push(theMatch[1]);
						removeKey("match.note");
					} else if ( theMatch[1].score === "" ) {
						teamRow2.append( $("<TD></TD>").html("-").addClass("opcaity-25").addClass(result) );
					} else {
						teamRow2.append( $("<TD></TD>").html(theMatch[1].score).addClass(result) );
					}

					removeKey("match.score");
					removeKey("match.home");
					removeKey("match.away");
					removeKey("match.season");
					removeKey("match.competition");
					removeKey("match.date");
				} else if ( theMatch.length === 1 && hasTwo ) {					
					teamRow2.append( $("<TD></TD>").html("--").addClass("noMatch") );
				}
			}
		});
		tblBody.append(teamRow);
		if ( hasTwo ) { tblBody2.append(teamRow2); }
	});

	tbl.append(tblBody);
	if ( hasTwo ) { tbl2.append(tblBody2); }
	
	if ( hasTwo ) { return [tbl,tbl2]; }
	return tbl;
}

function buildStandings(standings,ptsWin=3) {
	tbl = $("<TABLE></TABLE>").addClass("table").addClass("table-sm").addClass("table-hover").addClass("table--standings");

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
		thisRowHasNotes = false;

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
		if ( s.teamDivision ) {
			teamName += $("<SPAN></SPAN>")
				.addClass("badge")
				.addClass("badge-titleCount")
				.addClass("d-block")
				.addClass("fst-italic")
				.addClass("fw-normal")
				.addClass("text-black")
				.addClass("text-start")
				.html(s.teamDivision.name)
				.prop("outerHTML")
			removeKey("standings.teamDivision");
		}

		if ( ! s.missing ) {

			points = (s.w * ptsWin) + s.d;
			if ( s.carry_forward ) {
				points += s.carry_forward;
				thisRowNotes.append( $("<SPAN></SPAN>").addClass(thisRowHasNotes?'ms-3':'ms-0').html( "+"+s.carry_forward+" pts" ) );
				thisRowHasNotes = true;
				removeKey("standings.carry_forward");
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
				.append( $("<TD></TD>").html(points) )
				.append( $("<TD></TD>").html(s.f-s.a) )
				;
		} else {
			thisRow
				.append( $("<TD></TD>").html(s.place) )
				.append( $("<TH></TH>").attr("scope","row").html(teamName) )
				.append( $("<TD></TD>").attr("colspan",8).addClass("fst-italic").addClass("small").addClass("text-danger").addClass("text-start").html("Missing data") )
				;
			removeKey("standings.missing");
		}
		
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
							.addClass(thisRowHasNotes?'ms-3':'ms-0')
					);
					thisRowHasNotes = true;
				}
				removeKey("standings.target.season");
				removeKey("standings.target.level");
				removeKey("standings.target.name");
			}
		}
	
		if ( s.relegated ) {
			thisRow.addClass("is-relegated");
			removeKey("standings.relegated");
			removeKey("series.relegated");
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
							.addClass(thisRowHasNotes?'ms-3':'ms-0')
					);
					thisRowHasNotes = true;
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
					.addClass("faux-link")
					.addClass(thisRowHasNotes?'ms-3':'ms-0')
			);
			thisRowHasNotes = true;
			removeKey("standings.removed");
			removeKey("standings.removed_note");
		}
		if ( s.playoff ) {
			theText = getPlayoffName(s.playoff);
			if ( theText !== "" ) {
				thisRowNotes.append( $("<SPAN></SPAN>").addClass(thisRowHasNotes?'ms-3':'ms-0').addClass("faux-link").html(theText).on("click",function(){$("#po_"+s.playoff+"-tab").click();}) );
				thisRowHasNotes = true;
				thisRow.addClass("is-playoff_"+s.playoff);
				removeKey("standings.playoff");
			}
		}
		if ( s.merge ) {
			withTeams = [ allTeams[s.team] ];
			s.merge.with.forEach(w=>{
				withTeams.push(allTeams[w]);
			});
			withTeams = withTeams.join(" + ");
			newTeam = allTeams[s.merge.to];
			thisRowNotes.append(
				$("<ABBR></ABBR>")
					.attr("title",withTeams + " => " +newTeam)
					.html("Merged into "+newTeam)
					.addClass("faux-link")
					.addClass(thisRowHasNotes?'ms-3':'ms-0')
			);
			thisRowHasNotes = true;
			removeKey("standings.merge");
		}

		if ( s.title_count ) {
			thisRowNotes.append( $("<SPAN></SPAN>").addClass(thisRowHasNotes?'ms-3':'ms-0').html( getTitleCount(s.title_count)) );
			thisRowHasNotes = true;
			removeKey("standings.title_count");
		}

		if ( s.in_progress ) {
			removeKey("standings.in_progress");
			if ( ! s.champion && ! s.removed && ! s.relegated && ! s.promoted ) {
				thisRow.addClass("opacity-25");
			} else {
				thisRow.addClass("opacity-50");
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
		removeKey("standings.round");
		removeKey("standings.league");

		tbody.append(thisRow);
	});

	tbl.append(thead).append(tbody);

	return tbl;
}

function validateLeague(data) {
	if ( ! data.standings ) {
		if ( data.series && Array.isArray(data.series) ) {
			data.series.forEach(s=>{
				validateLeague(s);
			});
		}
		return;
	}
	totalW = totalD = totalL = totalF = totalA = 0;
	data.standings.forEach(s=>{
		if ( ! s.missing ) {
			totalW += s.w;
			totalD += s.d;
			totalL += s.l;
			totalF += s.f;
			totalA += s.a;
			if ( data.matches ) {
				myW = myD = myL = myF = myA = 0;
				myMatches = data.matches.filter(m=>{return m.home === s.team || m.away === s.team});
				if ( myMatches.length !== (s.w+s.d+s.l) ) {
					console.error(s.team,"Matches array does not include the right number of matches","Expected: "+(s.w+s.d+s.l),"Got: "+myMatches.length);
				}
				myMatches.forEach(m=>{
					thisScore = m.score.split("-");
					if ( m.home === s.team ) {
						myScore = thisScore[0];
						theirScore = thisScore[1];
					} else {
						myScore = thisScore[1];
						theirScore = thisScore[0];
					}
					myScore = parseInt(myScore);
					theirScore = parseInt(theirScore);
					myF += myScore;
					myA += theirScore;
					if ( myScore > theirScore ) {
						myW++;
					} else if ( myScore < theirScore ) {
						myL++;
					} else {
						myD++;
					}
				});
				if ( myW !== s.w ) {
					console.error(s.team,"Wins: Standings != Matches","Standings : "+s.w,"Matches: "+myW);
				}
				if ( myD !== s.d ) {
					console.error(s.team,"Draws: Standings != Matches","Standings : "+s.d,"Matches: "+myD);
				}
				if ( myL !== s.l ) {
					console.error(s.team,"Losses: Standings != Matches","Standings : "+s.l,"Matches: "+myL);
				}
				if ( myF !== s.f ) {
					console.error(s.team,"For: Standings != Matches","Standings : "+s.f,"Matches: "+myF);
				}
				if ( myA !== s.a ) {
					console.error(s.team,"Against: Standings != Matches","Standings : "+s.a,"Matches: "+myA);
				}        
			}
		}
	});
	if ( totalW !== totalL ) {
		console.error("Wins != Losses","Wins: "+totalW,"Losses: "+totalL);
	}
	if ( totalF !== totalA ) {
		console.error("For != Against","For: "+totalF,"Against: "+totalA);
	}
	if ( totalD % 2 !== 0 ) {
		console.error("Uneven number of draws","Draws: "+totalD,);
	}
}