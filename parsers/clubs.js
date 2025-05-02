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
    /*if ( data.matches ) {
        $("#theTabs").append(buildTabButton("matches","Head-to-Head",isFirstTab));
        matchesPanel = buildTabPanel("matches",isFirstTab);

        console.log("TODO: matches",data.matches);

        $("#theTabContent").append(matchesPanel);
        isFirstTab = false;
    }*/

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

        thisRow = $("<TR></TR>");
        thisRowNotes = $("<TD></TD>");

        ptsWin = s.pts_win ? s.pts_win : 3;

        if ( ! s.missing ) {
			thisRow
				.append( $("<TD></TD>").html(s.place) )
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
						$("<A></A>")
							.html(["Promoted to",s.target.season,s.target.name].join(" "))
							.attr("href","league.html?season="+s.target.season+"&level="+s.target.level)
					);
				}
			}
		}
	
		if ( s.relegated ) {
			thisRow.addClass("is-relegated");
			if ( s.target ) {

				if ( ! s.playoff ) {
					thisRowNotes.append(
						$("<A></A>")
							.html(["Relegated to",s.target.season,s.target.name].join(" "))
							.attr("href","league.html?season="+s.target.season+"&level="+s.target.level)
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
			}
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