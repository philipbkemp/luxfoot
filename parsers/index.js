$(document).ready(function(){
	
	$.ajax({
		url: "data/seasons.json",
		success: function(data) {
			parseSeasons(data);
		}
	})

});

function parseSeasons(data) {
	data.forEach(season=>{

		keys = "|" + Object.keys(season).join("|");

		listGroupItem = $("<DIV></DIV>").addClass("list-group-item");
		row = $("<DIV></DIV>").addClass("row");
		
		colSeason = $("<DIV></DIV>").addClass("col-1");
		colSeasonLink = $("<A></A>").attr("href","season.html?season="+season.season).html(season.season).addClass("p-1").addClass("d-block").addClass("text-center");
		colSeason.append(colSeasonLink);
		keys = keys.replace("|season","");
		row.append(colSeason);

		if ( season.note ) {
			colNote = $("<DIV></DIV>").addClass("col-11").addClass("py-1").addClass("fst-italic").html(season.note);
			keys = keys.replace("|note","");
			row.append(colNote);
		}

		if ( season.leagues ) {
			keys = keys + "|leagues."+ Object.keys(season.leagues).join("|leagues.");

			colLeague = $("<DIV></DIV>").addClass("col-2");

			if ( season.leagues.level_1 ) {
				colLeague.append( buildLeague(season.leagues.level_1,"leagues.level_1") );
				keys = keys.replace("|leagues.level_1","");
			}

			if ( season.leagues.level_2 ) {
				colLeague.append( buildLeague(season.leagues.level_2,"leagues.level_2") );
				keys = keys.replace("|leagues.level_2","");
			}

			if ( season.leagues.level_3 ) {
				colLeague.append( buildLeague(season.leagues.level_3,"leagues.level_3") );
				keys = keys.replace("|leagues.level_3","");
			}

			if ( season.leagues.level_4 ) {
				colLeague.append( buildLeague(season.leagues.level_4,"leagues.level_4") );
				keys = keys.replace("|leagues.level_4","");
			}

			if ( season.leagues.level_5 ) {
				colLeague.append( buildLeague(season.leagues.level_5,"leagues.level_5") );
				keys = keys.replace("|leagues.level_5","");
			}

			keys = keys.replace("|leagues","");

			row.append(colLeague);
		}

		listGroupItem.append(row);

		$("#seasons").prepend(listGroupItem);

		if ( keys.length !== 0 ) {
			console.warn(keys);
			console.log(season);
		}

	});

	$(".placeholder-glow").hide();
	$("#seasons").removeClass("d-none");
	$("#history").removeClass("d-none");
}

function buildLeague(league,name) {
	prefix = "|" + name + ".";
	leagueKeys = prefix+ Object.keys(league).join(prefix);

	ret = "";

	if ( ! league.missing ) {

		if ( ! league.series ) {

			ret = $("<A></A>").addClass("d-block").addClass("p-1");
			ret.attr("href","league.html?season="+league.season+"&level="+league.level);
			leagueKeys = leagueKeys.replace(prefix+"level","");
			leagueKeys = leagueKeys.replace(prefix+"season","");
			ret.html(league.name);
			leagueKeys = leagueKeys.replace(prefix+"name","");

		} else {

			ret = $("<SPAN></SPAN>").addClass("d-block").addClass("p-1").html(league.name);
			leagueKeys = leagueKeys.replace(prefix+"name","");
			leagueKeys = leagueKeys.replace(prefix+"season","");
			leagueKeys = leagueKeys.replace(prefix+"level","");

			seriesPrefix = prefix + "series.";
			league.series.forEach(series=>{
				seriesKeys = seriesPrefix+ Object.keys(series).join(seriesPrefix);

				if ( ! series.missing ) {
					retSeries = $("<A></A>").addClass("d-block").addClass("p-1").addClass("ps-4");
					retSeries.attr("href","league.html?season="+league.season+"&level="+series.level+"&series="+series.series);
				} else {
					retSeries = $("<SPAN></SPAN>").addClass("p-1").addClass("d-block").html(league.name);
					seriesKeys = seriesKeys.replace(seriesPrefix+"missing","");
				}
				seriesKeys = seriesKeys.replace(seriesPrefix+"level","");
				seriesKeys = seriesKeys.replace(seriesPrefix+"series","");
				seriesKeys = seriesKeys.replace(seriesPrefix+"season","");
				retSeries.html(series.name.replace(league.name+" ",""));
				seriesKeys = seriesKeys.replace(seriesPrefix+"name","");

				// winner not shown
				seriesKeys = seriesKeys.replace(seriesPrefix+"winner","");

				ret.append(retSeries);

				if ( seriesKeys.length !== 0 ) {
					console.warn(seriesKeys);
					console.log(league);
				}
			});

			leagueKeys = leagueKeys.replace(prefix+"series","");
		}

	} else {
		leagueKeys = leagueKeys.replace(prefix+"missing","");
		ret = $("<SPAN></SPAN>").addClass("p-1").addClass("d-block").html(league.name);
		leagueKeys = leagueKeys.replace(prefix+"name","");
		leagueKeys = leagueKeys.replace(prefix+"level","");
		leagueKeys = leagueKeys.replace(prefix+"season","");
	}

	// not shown
	leagueKeys = leagueKeys.replace(prefix+"winner","");
	leagueKeys = leagueKeys.replace(prefix+"title_count","");

	if ( leagueKeys.length !== 0 ) {
		console.warn(leagueKeys);
		console.log(league);
	}

	return ret;
}