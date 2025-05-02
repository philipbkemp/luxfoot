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

		po_downup = null;
		po_updown = null;

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
				if ( series.matches ) {
					seriesPanel.append( buildResultsTable(series.teams,series.matches) );
					seriesPanel.append(
						$("<DIV></DIV>").addClass("alert").addClass("alert-info").addClass("d-inline-block").html(
							"<strong>Legend:</strong> <span class='homeWin'></span>Home win <span class='awayWin'></span>Away win <span class='draw'></span>Draw"
						)
					);
					removeKey("series.matches");
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

					removeKey("series.playoffs");
				}

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

		if ( po_downup ) {
			$("#leagueTabContent").append(po_downup);
		}
		if ( po_updown ) {
			$("#leagueTabContent").append(po_updown);
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
		if ( league.links.up ) {
			$("#menu-links").append(
				$("<LI></LI>").append(
					$("<A></A>").addClass("p-2").attr("href","league.html?season="+league.season+"&level="+league.links.up).html("Up a level")
				)
			);
			removeKey("links.up");
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
	removeKey("promotion");
	removeKey("teams");

	if ( keys.length !== 0 ) {
		console.log(league);
		console.log(keys);
	}

	$(".placeholder-glow").addClass("d-none");
	$(".displayAfterLoad").removeClass("d-none");
}

function buildResultsTable(teams,results) {
	tbl = $("<TABLE></TABLE>").addClass("table").addClass("table-sm").addClass("table-hover").addClass("table--results");
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
					removeKey("match.date");
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
					.addClass("faux-link")
			);
			removeKey("standings.removed");
			removeKey("standings.removed_note");
		}
		if ( s.playoff ) {
			theText = "";
			switch ( s.playoff ) {
				case "downup":
				case "relegation":
					theText = "Relegation play-off"; break;
				case "league_promotionplayoff":
				case "promotion":
				case "updown":
					theText = "Promotion play-off"; break;
				case "league_promotion_playoff_a":
				case "league_promotion_playoff_b":
					theText = "Play-off";
					break;
				case "title":
					theText = "Title Decider";
					break;
			}
			if ( theText !== "" ) {
				thisRowNotes.append( $("<SPAN></SPAN>").addClass("me-2").addClass("faux-link").html(theText).on("click",function(){$("#po_"+s.playoff+"-tab").click();}) );
				thisRow.addClass("is-playoff_"+s.playoff);
				removeKey("standings.playoff");
			}
		}

		if ( s.title_count ) {
			thisRowNotes.append( $("<SPAN></SPAN>").addClass("me-2").html( getTitleCount(s.title_count)) );
			removeKey("standings.title_count");
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