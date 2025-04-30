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

    luxCupPanel.html("luxembourg cup coming soon");
    flfCupPanel.html("coupe flf coming soon");

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
    rowNum = 1;

    winners = {};
    data.forEach(season=>{
        if ( season.leagues && season.leagues.level_1 && season.leagues.level_1 && season.leagues.level_1.winner && season.leagues.level_1.winner !== "" ) {
            if ( ! winners[season.leagues.level_1.winner] ) {
                winners[season.leagues.level_1.winner] = [];
            }
            winners[season.leagues.level_1.winner].push( season.season );
        }
    });

    Object.keys(winners).forEach(c=>{
        winners[c]
    });
    sortedWinners = Object.entries(winners).sort(([, arrA], [, arrB]) => arrB.length - arrA.length);

    sortedWinners.forEach(club=>{
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
                $("<A></A>").attr("href","season.html?season="+yr+"&level=1").html(yr)
            ).append(" ");;
        });
        thisRow.append(thisYears);

        leagueBody.append(thisRow);
        rowNum++;
    });
    leagueTable.append(leagueBody);
    leaguePanel.append(leagueTable);

    $("#theTabContent").append(leaguePanel);
    $("#theTabContent").append(luxCupPanel);
    $("#theTabContent").append(flfCupPanel);

    $(".placeholder-glow").addClass("d-none");
    $(".displayAfterLoad").removeClass("d-none");
}