$(document).ready(function(){
	
	if ( checkParams(["level"]) ) {

		$.ajax({
			url: "data/teams.json",
			success: function(data) {
				parseTeams(data);
			}
		});

	}

});

function doneParsingTeams() {
	$.ajax({
		url: "data/seasons.json",
		success: function(data) {
			parseSeasons(data);
		}
	});
}

function parseSeasons(data) {
	data.forEach(season=>{

		if ( season.leagues && season.leagues["level_"+urlParams.level] ) {

			setTitles("Level " + urlParams.level);

			thisLevel = season.leagues["level_"+urlParams.level];

			keys = "|" + Object.keys(thisLevel).join("|") + "|";

			listGroupItem = $("<DIV></DIV>").addClass("list-group-item");
			row = $("<DIV></DIV>").addClass("row");
			
			colSeason = $("<DIV></DIV>").addClass("col-1");
			colSeasonLink = '<span class="d-block py-1 text-center">'+season.season+'</span>';
			keys = keys.replace("|missing|","|").replace("||","|");
			
			
			colSeason.append(colSeasonLink);
			keys = keys.replace("|season|","|").replace("||","|");
			row.append(colSeason);

			if ( thisLevel.series ) {

				thisLevel.series.forEach(serie=>{
					keys = "|series." + Object.keys(serie).join("|series.") + "|";

					seriesLink = $("<A></A>").attr("href","league.html?season="+season.season+"&level="+urlParams.level+"&series="+serie.series).html(serie.name.replace("Division ","Division<br/>").replace("Series ","S.")).addClass("p-1").addClass("d-block");
					keys = keys.replace("|series.series|","|").replace("||","|");
					colSeries = $("<DIV></DIV>").addClass("col-1").addClass("px-0").append(seriesLink);
					row.append(colSeries);
					keys = keys.replace("|series.name|","|").replace("||","|");

					colWinner = $("<DIV></DIV>").addClass("col-2").addClass("py-1").html(allTeams[serie.winner]);
					row.append(colWinner);
					keys = keys.replace("|series.winner|","|").replace("||","|");

					keys = keys.replace("|series.season|","|").replace("||","|");
					keys = keys.replace("|series.level|","|").replace("||","|");
				});
				keys = keys.replace("|series|","|").replace("||","|");

			} else {

				colName = $("<DIV></DIV>").addClass("col-2");
				if ( ! thisLevel.missing ) {
					seasonLink = $("<A></A>").attr("href","league.html?season="+season.season+"&level="+urlParams.level).html(thisLevel.name).addClass("p-1").addClass("d-block");
				} else {
					seasonLink = thisLevel.name;
					colName.addClass("px-3");
				}
				colName.append(seasonLink);
				row.append(colName);
				keys = keys.replace("|name|","|").replace("||","|");

				colWinner = $("<DIV></DIV>").addClass("col-3").addClass("py-1").html(allTeams[thisLevel.winner]);
				row.append(colWinner);
				keys = keys.replace("|winner|","|").replace("||","|");

				colCount = $("<DIV></DIV>").addClass("col-3").addClass("py-1").html("");
				if ( thisLevel.title_count ) {
					levelWinnerCount = $("<SPAN></SPAN>").addClass("badge").addClass("badge-titleCount").html(getTitleCount(thisLevel.title_count));
					colCount.append(levelWinnerCount);
					keys = keys.replace("|title_count|","|").replace("||","|");
				}
				row.append(colCount);
			}

			listGroupItem.append(row);

			$("#seasons").prepend(listGroupItem);

			keys = keys.replace("|level|","|").replace("||","|");

			if ( keys !== "|" ) {
				console.warn(keys);
				console.log(season);
			}
		}

	});

	$(".placeholder-glow").hide();
	$("#seasons").removeClass("d-none");
	$("#history").removeClass("d-none");
}