$(document).ready(function(){

    checkParams();

	if ( urlParams["club"] ) {

        $.ajax({
			url: "clubs/"+urlParams["club"]+".json",
			success: function(data) {
				parseClub(data);
			},
            error: function(data) {
                $("<DIV></DIV>").addClass("alert").addClass("alert-danger").html("Unable to load club").insertAfter(".lf-nav");
                $(".placeholder").hide();
                $(".displayAfterLoad").removeClass("d-none");
            }
		});
    
    } else {

        $(".placeholder-glow").addClass("d-none");
        $("#show-empty").removeClass("d-none");
        $("h1 span:not(.lf)").html("Clubs");
        $(".displayAfterLoad").removeClass("d-none");

    }

});

function parseClub(data) {
    $("h1 span.lf").append(" / Clubs");
    $("h1 span:not(.lf)").html(data.name);
    $("title").append(" / " + data.name);

    isFirstTab = true;

    // trophies
    if ( data.trophies ) {
        $("#theTabs").append(buildTabButton("trophies","Trophy Cabinet",isFirstTab));
        trophyPanel = buildTabPanel("trophies",isFirstTab);

        trophyPanel.append( drawTrophies(data.trophies) );

        $("#theTabContent").append(trophyPanel);
        isFirstTab = false;
    }

    // standings
    if ( data.standings ) {
        $("#theTabs").append(buildTabButton("standing","League History",isFirstTab));
        standingsPanel = buildTabPanel("standing",isFirstTab);

        standingsPanel.append( drawStandings(data.standings) );

        $("#theTabContent").append(standingsPanel);
        isFirstTab = false;
    }

    // matches
    if ( data.matches ) {
        $("#theTabs").append(buildTabButton("matches","Head-to-Head",isFirstTab));
        matchesPanel = buildTabPanel("matches",isFirstTab);

        matchesPanel.append( drawMatches(data.matches,data.id) );

        $("#theTabContent").append(matchesPanel);
        isFirstTab = false;
    }

    // europe
    /*if ( data.europe ) {
        $("#theTabs").append(buildTabButton("europe","European Record",isFirstTab));
        matchesPanel = buildTabPanel("europe",isFirstTab);
        
        console.log("TODO: europe",data.europe);

        $("#theTabContent").append(europePanel);
        $("#theTabContent").append(leaguePanel);
        isFirstTab = false;
    }*/

    $(".placeholder-glow").addClass("d-none");
    $(".displayAfterLoad").removeClass("d-none");
    $(".showIfClub").removeClass("d-none");
}

function drawTrophies(trophies) {
    trophy = $("<DIV></DIV>").addClass("g-4").addClass("row").addClass("row-cols-6").addClass("trophy-list");

    trophies.forEach(t=>{
        thisTrophy = $("<DIV></DIV>").addClass("col");
        thisTrophyLink = $("<A></A>").addClass("card");
        if ( t.cup ) {
            thisTrophyLink.attr("href","cup.html?season="+t.season+"&comp="+t.cup)
        } else if ( t.league ) {
            thisTrophyLink.attr("href","league.html?season="+t.season+"&level=1")
        }
        thisTrophyImg = $("<DIV></DIV>").addClass("card-img").html(t.title_count);
        thisTrophyBody = $("<DIV></DIV>").addClass("card-body");
        thisTrophyComp = $("<STRONG></STRONG>").addClass("card-title").html(t.name);
        thisTrophySeason =$("<P></P>").addClass("card-text").html(t.season);
        thisTrophyBody.append(thisTrophyComp).append(thisTrophySeason);
        thisTrophyLink.append(thisTrophyImg).append(thisTrophyBody);
        thisTrophy.append(thisTrophyLink);
        trophy.append(thisTrophy);
    });

    return trophy;
}

function drawStandings(standings) {
    tbl = $("<TABLE></TABLE>").addClass("table").addClass("table-sm").addClass("table-hover").addClass("table--standings").addClass("table--standings-history");

	thead = $("<THEAD></THEAD>");
	theadRow = $("<TR></TR>");
	theadRow
		.append( $("<TH></TH>").attr("scope","col").html("") )
		.append( $("<TH></TH>").attr("scope","col").html("Season") )
		.append( $("<TH></TH>").attr("scope","col").html("League") )
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

        thisRow = $("<TR></TR>");
        thisRowNotes = $("<TD></TD>");

        ptsWin = s.pts_win ? s.pts_win : 3;

        if ( ! s.missing ) {
			thisRow
				.append( $("<TD></TD>").html(s.place) )
				.append( $("<TH></TH>").attr("scope","row").html(s.season) )
				.append( $("<TH></TH>").attr("scope","row").html(s.league) )
				.append( $("<TD></TD>").html(s.w+s.d+s.l) )
				.append( $("<TD></TD>").html(s.w) )
				.append( $("<TD></TD>").html(s.d) )
				.append( $("<TD></TD>").html(s.l) )
				.append( $("<TD></TD>").html(s.f) )
				.append( $("<TD></TD>").html(s.a) )
				.append( $("<TD></TD>").html((s.w*ptsWin)+s.d) )
				.append( $("<TD></TD>").html(s.f-s.a) )
				;
		} else {
			thisRow
				.append( $("<TD></TD>").html(s.place) )
				.append( $("<TH></TH>").attr("scope","row").html(s.season) )
				.append( $("<TH></TH>").attr("scope","row").html(s.league) )
				.append( $("<TD></TD>").attr("colspan",8).addClass("fst-italic").addClass("small").addClass("text-danger").addClass("text-start").html("Missing data") )
				;
			removeKey("standings.missing");
		}
        
		
		if ( s.champion ) {
			thisRow.addClass("is-champion");
		}
	
		if ( s.promoted ) {
			thisRow.addClass("is-promoted");
			if ( s.target ) {
				
				if ( ! s.playoff ) {
					thisRowNotes.append(
						$("<SPAN></SPAN>")
							.html(["Promoted to",s.target.season,s.target.name].join(" "))
					);
				}
			}
		}
	
		if ( s.relegated ) {
			thisRow.addClass("is-relegated");
			if ( s.target ) {

				if ( ! s.playoff ) {
					thisRowNotes.append(
						$("<SPAN></SPAN>")
							.html(["Relegated to",s.target.season,s.target.name].join(" "))
					);
				}
			}
		}
	
		if ( s.removed ) {
			thisRow.addClass("is-removed");
			
			thisRowNotes.append(
				$("<ABBR></ABBR>")
					.attr("title",s.removed_note)
					.html("Removed")
					.addClass("faux-link")
			);
		}

		if ( s.title_count ) {
			thisRowNotes.append( $("<SPAN></SPAN>").addClass("me-2").html( getTitleCount(s.title_count)) );
		}

		thisRow.append(thisRowNotes);
        tbody.append(thisRow);

    });

    tbl.append(thead).append(tbody);

    return tbl;
}

function drawMatches(matches,thisClub) {
    opps = {};
    matches.forEach(m=>{
        scoreParts = m.score.split("-");
        homeScore = parseInt(scoreParts[0]);
        awayScore = parseInt(scoreParts[1]);
        result = "";
        if ( homeScore > awayScore ) {
            result = "h";
        } else if ( homeScore < awayscore ) {
            result = "a";
        } else if ( homeScore === awayScore ) {
            result = "d";
        }
        if ( m.penalties ) {
            console.warn("not handled: penalties");
        }
        if ( thisClub !== m.home && thisClub === m.away ) {
            // opp = home ; me = away
            if ( ! opps[m.home] ) {
                opps[m.home] = {
                    w: 0,
                    d: 0,
                    l: 0,
                    f: 0,
                    a: 0
                };
            }
            switch ( result ) {
                case "h": opps[m.home].l++; break;
                case "a": opps[m.home].w++; break;
                case "d": opps[m.home].d++; break;
            }
            opps[m.home].f += awayScore;
            opps[m.home].a += homeScore;
        } else if ( thisClub === m.home && thisClub !== m.away ) {
            // opp = away ; me = home
            if ( ! opps[m.away] ) {
                opps[m.away] = {
                    w: 0,
                    d: 0,
                    l: 0,
                    f: 0,
                    a: 0
                };
            }
            switch ( result ) {
                case "h": opps[m.away].w++; break;
                case "a": opps[m.away].l++; break;
                case "d": opps[m.away].d++; break;
            }
            opps[m.away].f += homeScore;
            opps[m.away].a += awayScore;
        } else {
            // who?
            console.error(m);
        }
    });

    console.log(opps);

    return "coming soon...";
}