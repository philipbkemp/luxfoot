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

				colName = $("<DIV></DIV>").addClass("col-1");
				seasonLink = thisLevel.name;
				colName.addClass("px-3").addClass("py-1");
				colName.append(seasonLink);
				row.append(colName);

				thisLevel.series.forEach(serie=>{
					keys = "|series." + Object.keys(serie).join("|series.") + "|";

					seriesDiv = $("<DIV></DIV>").addClass("col-2").addClass("py-1");
					seriesDiv.append(allTeams[serie.winner]);
					seriesDiv.append( $("<BR/>") );

					seriesLink = $("<A></A>").addClass("badge").addClass("badge-titleCount").addClass("ms-0").html( serie.name );
					seriesLink.attr("href","league.html?season="+thisLevel.season+"&level="+thisLevel.level+"&series="+serie.series);
					seriesDiv.append(seriesLink);

					row.append(seriesDiv);

					keys = keys.replace("|series.season|","|").replace("||","|");
					keys = keys.replace("|series.level|","|").replace("||","|");
					keys = keys.replace("|series.series|","|").replace("||","|");
					keys = keys.replace("|series.winner|","|").replace("||","|");
					keys = keys.replace("|series.name|","|").replace("||","|");
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