clubs = [];
seasonCount = 0;
leagueSizes = [];

function drawChart(club) {
    
    chartTemplate = document.getElementById("pos_chart");
    chart = chartTemplate.content.cloneNode(true);
    
    loadSeason("1909-10",["RACL","HLBN","SCLX","JESH","URUM","JECT","CROD","NESH","GDUD"]);
    loadSeason("1910-11",["SCLX","SDIF","HLBN","MANC"]);
    loadSeason("1911-12",["HLBN","SCLX","RACL","DEIC"]);
    loadSeason("1912-13");
    loadSeason("1913-14",["HLBN","SCLX","RACL","SDIF","JESH","CPET"]);
    loadSeason("1914-15",["HLBN","SCLX|JESH|SDUD|CPET|YBDK","RACL|FOLA|USDD|SDIF|CECH"],["PHLK|UESH","ROLG|JKYL"]);
    loadSeason("1915-16",["HLBN","SCLX","FOLA","RACL","JESH","SDUD"],["YBDK","SDIF","CPET"],["CSHL|JBET","JSTF|NSCH","ROLG|ERDU"]);
    loadSeason("1916-17",["HLBN","FOLA","RACL","SCLX","YBDK","JESH"],["CPET","SDIF","SDUD","CSHL","UESH"],["AVBG|URUM","JWMK|NSCH","WALF|STET","ROLG|BLVL"]);
    loadSeason("1917-18",["FOLA","HLBN","SCLX","YBDK","RACL","CPET"],["JESH","SDIF","SDUD","URUM","CSHL"],["AVBG|STET","CMLB|ECBT","JWMK|NSCH","ADUD"]);
    loadSeason("1918-19",["SCLX","FOLA","JESH","HLBN","RACL","YBDK"],["SDUD","SDIF","AVBG","URUM","CPET"],["CMLB|CROD","ETZE|NSCH","SWFT|ECBT","CLMC|STET","ADUD"]);
    
    positionHeight = 5;
    
	t1d = "M45,69";
	t2d = "M95,69";
	t3d = "M105,69";
	t4d = "M155,69";
	t5d = "M275,69";
	t6d = "M595,69";
    
    leagueSizes.forEach(s=>{

		one = s.length >= 1 ? s[0] : null;
		two = s.length >= 2 ? one + s[1] : null;
		three = s.length >= 3 ? two + s[2] : null;
		four = s.length >= 4 ? (three + s[3]) : null;
		five = s.length >= 5 ? (four + s[4]) : null;
		six = s.length >= 6 ? (five + s[5]) : null;

		onePos = one*positionHeight
		t1d += "v" + onePos + "h10v-" + onePos + "h-10h10";

		if ( two !== null ) {
			twoPos = two*positionHeight;
			t2d += "v" + twoPos + "h10v-" + twoPos + "h-10h10";
		}

		if ( three !== null ) {
			threePos = three*positionHeight;
			t3d += "v" + threePos + "h10v-" + threePos + "h-10h10";
		}

		if ( four !== null ) {
			fourPos = four*positionHeight;
			t4d += "v" + fourPos + "h10v-" + fourPos + "h-10h10";
		}

		if ( five !== null ) {
			fivePos = five*positionHeight;
			t5d += "v" + fivePos + "h10v-" + fivePos + "h-10h10";
		}

		if ( six !== null ) {
			sixPos = six*positionHeight;
			t6d += "v" + sixPos + "h10v-" + sixPos + "h-10h10";
		}
        
    });
    
    document.getElementById("dataContainer").append(chart);

	document.getElementById("t1").setAttribute("d",t1d);
	document.getElementById("t2").setAttribute("d",t2d);
	document.getElementById("t3").setAttribute("d",t3d);
	document.getElementById("t4").setAttribute("d",t4d);
	document.getElementById("t5").setAttribute("d",t5d);
	document.getElementById("t6").setAttribute("d",t6d);
    
    drawFocus(club);
}

function drawFocus(club) {
    focus = club.toUpperCase();
    team = clubs[focus];
    teamName = allTeams[focus].name;
	start = 50;
	p0 = 73 - positionHeight;
	line = "";
	started = false;
	current = p0;
	gap = 10;
	consecutive = 0;
	team.forEach(position=>{
		if ( position === null ) {
			if ( started ) {
				if ( consecutive === 1 ) {
					line += "l2,0";
					gap += 8;
				} else {
					gap += 10;
				}
			} else {
				start += 10;
			}
			consecutive = 0;
		} else {
			place = p0 + (position*positionHeight);
			if ( gap !== 10 ) {
				line += "m"+gap;
				diff = place - current;
				line += ","+diff;
				gap = 10;
			} else {
				if ( ! started ) {
					line += "M"+start+","+place;
					started = true;
				} else {
					diff = place - current;
					line += "l10,"+diff;
				}
			}
			current = place;
			consecutive++;
		}
	});
	if ( consecutive === 1 ) {
		line += "l2,0";
	}
	document.getElementById("POS").setAttribute("d",line);
	document.getElementById("title").innerHTML = teamName + " league history 1909-2025";
}

function loadSeason(season,level1=[],level2=[],level3=[],level4=[],level5=[],level6=[]) {
    thisLeagueSize = [
        level1.length,
        level2.length,
        level3.length,
        level4.length,
        level5.length,
        level6.length
    ];
    thisLeagueSize = thisLeagueSize.filter(key => key !== 0);
    leagueSizes.push(thisLeagueSize);
    p = 1;
    [...level1,...level2,...level3,...level4,...level5,...level6].forEach(cc=>{
        cc.split("|").forEach(c=>{
            if ( ! clubs[c] ) {
                clubs[c] = [];
                for ( i=1 ; i<=seasonCount ; i++ ) {
                    clubs[c].push(null);
                }
            }
            clubs[c].push(p);
        });
        p++;
    });
    seasonCount++;
    Object.keys(clubs).forEach(c=>{
        if ( clubs[c].length !== seasonCount ) {
            clubs[c].push( null );
        }
    });
}