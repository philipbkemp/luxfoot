$(document).ready(function(){

	$.ajax({
        url: "data/teams.json",
        success: function(data) {
            parseTeams(data);
        }
    })

});

function doneParsingTeams(data) {
	$.ajax({
		url: "data/seasons.json",
		success: function(data) {
			parseSeasons(data);
		}
	})
}

function parseSeasons(data) {
    $("#theTabs").append(buildTabButton("league","League",true));
    $("#theTabs").append(buildTabButton("luxcup","Luxembourg Cup"));
    $("#theTabs").append(buildTabButton("flfcup","FLF Cup"));

    leaguePanel = buildTabPanel("league",true);
    luxCupPanel = buildTabPanel("luxcup");
    flfCupPanel = buildTabPanel("flfcup");

    leagueTable = $("<TABLE></TABLE>").addClass("table").addClass("table-hover").addClass("table-sm").attr("id","winners--league").addClass("winners--table");;
    leagueHead = $("<THEAD></THEAD>");
    leagueHeadRow = $("<TR></TR>")
        .append( $("<TH></TH>").attr("scope","col").addClass("d-none").addClass("d-sm-table-cell").html("") )
        .append( $("<TH></TH>").attr("scope","col").html("Team") )
        .append( $("<TH></TH>").attr("scope","col").addClass("text-center").html("Titles") )
        .append( $("<TH></TH>").attr("scope","col").addClass("d-none").addClass("d-sm-table-cell").html("") )
        ;
    leagueHead.append(leagueHeadRow);
    leagueTable.append(leagueHead);
    leagueBody = $("<TBODY></TBODY>");

    luxCupTable = $("<TABLE></TABLE>").addClass("table").addClass("table-hover").addClass("table-sm").attr("id","winners--league").addClass("winners--table");;
    luxCupHead = $("<THEAD></THEAD>");
    luxCupHeadRow = $("<TR></TR>")
        .append( $("<TH></TH>").attr("scope","col").addClass("d-none").addClass("d-sm-table-cell").html("") )
        .append( $("<TH></TH>").attr("scope","col").html("Team") )
        .append( $("<TH></TH>").attr("scope","col").addClass("text-center").html("Titles") )
        .append( $("<TH></TH>").attr("scope","col").addClass("d-none").addClass("d-sm-table-cell").html("") )
        ;
    luxCupHead.append(luxCupHeadRow);
    luxCupTable.append(luxCupHead);
    luxCupBody = $("<TBODY></TBODY>");

    flfCupTable = $("<TABLE></TABLE>").addClass("table").addClass("table-hover").addClass("table-sm").attr("id","winners--league").addClass("winners--table");;
    flfCupHead = $("<THEAD></THEAD>");
    flfCupHeadRow = $("<TR></TR>")
        .append( $("<TH></TH>").attr("scope","col").addClass("d-none").addClass("d-sm-table-cell").html("") )
        .append( $("<TH></TH>").attr("scope","col").html("Team") )
        .append( $("<TH></TH>").attr("scope","col").addClass("text-center").html("Titles") )
        .append( $("<TH></TH>").attr("scope","col").addClass("d-none").addClass("d-sm-table-cell").html("") )
        ;
    flfCupHead.append(flfCupHeadRow);
    flfCupTable.append(flfCupHead);
    flfCupBody = $("<TBODY></TBODY>");

    leagueWinners = {};
    luxCupWinners = {};
    flfCupWinners = {};
    data.forEach(season=>{
        if ( season.leagues && season.leagues.level_1 && season.leagues.level_1.winner && season.leagues.level_1.winner !== "" ) {
            if ( ! leagueWinners[season.leagues.level_1.winner] ) {
                leagueWinners[season.leagues.level_1.winner] = [];
            }
            leagueWinners[season.leagues.level_1.winner].push( season.season );
        }
        if ( season.cups && season.cups.cup_luxembourg && season.cups.cup_luxembourg.winner && season.cups.cup_luxembourg.winner !== "" ) {
            if ( ! luxCupWinners[season.cups.cup_luxembourg.winner] ) {
                luxCupWinners[season.cups.cup_luxembourg.winner] = [];
            }
            luxCupWinners[season.cups.cup_luxembourg.winner].push( season.season );
        }
        if ( season.cups && season.cups.cup_flf && season.cups.cup_flf.winner && season.cups.cup_flf.winner !== "" ) {
            if ( ! flfCupWinners[season.cups.cup_flf.winner] ) {
                flfCupWinners[season.cups.cup_flf.winner] = [];
            }
            flfCupWinners[season.cups.cup_flf.winner].push( season.season );
        }        
    });

    Object.keys(leagueWinners).forEach(c=>{
        leagueWinners[c]
    });
    sortedLeagueWinners = Object.entries(leagueWinners).sort(([, arrA], [, arrB]) => arrB.length - arrA.length);

    Object.keys(luxCupWinners).forEach(c=>{
        luxCupWinners[c]
    });
    sortedCupWinners = Object.entries(luxCupWinners).sort(([, arrA], [, arrB]) => arrB.length - arrA.length);

    Object.keys(flfCupWinners).forEach(c=>{
        flfCupWinners[c]
    });
    sortedFlfWinners = Object.entries(flfCupWinners).sort(([, arrA], [, arrB]) => arrB.length - arrA.length);

    rowNum = 1;
    sortedLeagueWinners.forEach(club=>{
        cname = allTeams[club[0]];
        count = club[1].length;
        years = club[1];

        thisRow = $("<TR></TR>").attr("id",club[0]);

        thisPos = $("<TD></TD>").addClass("d-none").addClass("d-sm-table-cell").html(rowNum);
        thisRow.append(thisPos);

        thisClub = $("<TH></TH>").attr("scope","row");
        thisClub.append(
            $("<A></A>").attr("href","clubs.html?club="+club[0].toLowerCase()).html(cname)
        );
        thisRow.append(thisClub);

        thisCount = $("<TD></TD>").addClass("text-center").html(count);
        thisRow.append(thisCount);

        thisYears = $("<TD></TD>").addClass("d-none").addClass("d-sm-table-cell");
        years.forEach(yr=>{
            thisYears.append(
                $("<A></A>").attr("href","league.html?season="+yr+"&level=1").html(yr)
            ).append(" ");;
        });
        thisRow.append(thisYears);

        leagueBody.append(thisRow);
        rowNum++;
    });
    leagueTable.append(leagueBody);
    leaguePanel.append(leagueTable);

    rowNum = 1;
    sortedCupWinners.forEach(club=>{
        cname = allTeams[club[0]];
        count = club[1].length;
        years = club[1];

        thisRow = $("<TR></TR>").attr("id",club[0]);

        thisPos = $("<TD></TD>").addClass("d-none").addClass("d-sm-table-cell").html(rowNum);
        thisRow.append(thisPos);

        thisClub = $("<TH></TH>").attr("scope","row");
        thisClub.append(
            $("<A></A>").attr("href","clubs.html?club="+club[0].toLowerCase()).html(cname)
        );
        thisRow.append(thisClub);

        thisCount = $("<TD></TD>").addClass("text-center").html(count);
        thisRow.append(thisCount);

        thisYears = $("<TD></TD>").addClass("d-none").addClass("d-sm-table-cell");
        years.forEach(yr=>{
            thisYears.append(
                $("<A></A>").attr("href","league.html?season="+yr+"&level=1").html(yr)
            ).append(" ");;
        });
        thisRow.append(thisYears);

        luxCupBody.append(thisRow);
        rowNum++;
    });
    luxCupTable.append(luxCupBody);
    luxCupPanel.append(luxCupTable);

    rowNum = 1;
    sortedFlfWinners.forEach(club=>{
        cname = allTeams[club[0]];
        count = club[1].length;
        years = club[1];

        thisRow = $("<TR></TR>").attr("id",club[0]);

        thisPos = $("<TD></TD>").addClass("d-none").addClass("d-sm-table-cell").html(rowNum);
        thisRow.append(thisPos);

        thisClub = $("<TH></TH>").attr("scope","row");
        thisClub.append(
            $("<A></A>").attr("href","clubs.html?club="+club[0].toLowerCase()).html(cname)
        );
        thisRow.append(thisClub);

        thisCount = $("<TD></TD>").addClass("text-center").html(count);
        thisRow.append(thisCount);

        thisYears = $("<TD></TD>").addClass("d-none").addClass("d-sm-table-cell");
        years.forEach(yr=>{
            thisYears.append(
                $("<A></A>").attr("href","league.html?season="+yr+"&level=1").html(yr)
            ).append(" ");;
        });
        thisRow.append(thisYears);

        flfCupBody.append(thisRow);
        rowNum++;
    });
    flfCupTable.append(flfCupBody);
    flfCupPanel.append(flfCupTable);

    $("#theTabContent").append(leaguePanel);
    $("#theTabContent").append(luxCupPanel);
    $("#theTabContent").append(flfCupPanel);

    $(".placeholder-glow").addClass("d-none");
    $(".displayAfterLoad").removeClass("d-none");
}