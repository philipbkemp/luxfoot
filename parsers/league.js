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
		$("#leagueTabContent").append(standingsPanel);
		removeKey("pts_win");
		removeKey("standings");
	}
	if ( league.matches ) {
		$("#leagueTabs").append(buildTabButton("matches","Results Table"));
		matchesPanel = buildTabPanel("matches");
		matchesPanel.append( buildResultsTable(league.teams,league.matches) );
		$("#leagueTabContent").append(matchesPanel);
		removeKey("teams");
		removeKey("matches");
	}
	if ( league.playoffs ) {
		if ( league.playoffs.relegation ) {
			$("#leagueTabs").append(buildTabButton("po_relegation","Relegation play-off"));
			poRelegation = buildTabPanel("po_relegation");
			poRelegation.html("relegation play-off");
			$("#leagueTabContent").append(poRelegation);
		}
	}

	removeKey("level");

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
		topRow.append( $("<TH></TH>").attr("scope","col").html(t) );
	});
	tblBody.append(topRow);

	teams.forEach(t=>{
		teamRow = $("<TR></TR>");
		teamRow.append( $("<TH></TH>").attr("scope","row").html( allTeams[t] ) );
		teams.forEach(tt=>{
			if ( tt === t ) {
				teamRow.append( $("<TD></TD>").html("") );
			} else {
				theMatch = results.filter(m=>{return m.home===t && m.away===tt;});
				if ( theMatch.length === 1 ) {
					teamRow.append( $("<TD></TD>").html(theMatch[0].score) );
				} else {
					teamRow.append( $("<TD></TD>").html("--") );
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
		.append( $("<TH></TH>").attr("scope","col").html("#") )
		.append( $("<TH></TH>").attr("scope","col").html("Team") )
		.append( $("<TH></TH>").attr("scope","col").html("P") )
		.append( $("<TH></TH>").attr("scope","col").html("W") )
		.append( $("<TH></TH>").attr("scope","col").html("D") )
		.append( $("<TH></TH>").attr("scope","col").html("L") )
		.append( $("<TH></TH>").attr("scope","col").html("F") )
		.append( $("<TH></TH>").attr("scope","col").html("A") )
		.append( $("<TH></TH>").attr("scope","col").html("Pts") )		
		.append( $("<TH></TH>").attr("scope","col").html("GD") )
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
			.append( $("<TD></TD>") )
			;
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

	/*

	<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>John</td>
      <td>Doe</td>
      <td>@social</td>
    </tr>
  </tbody>
</table>*/
}