let clubs = [];
let seasonCount = 0;
let leagueSizes = [];
const positionHeight = 5;

function drawChart(club) {

    const chartTemplate = document.getElementById("pos_chart");
    const chart = chartTemplate.content.cloneNode(true);

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
	loadSeason("1919-20",["FOLA","SDUD","SCLX","HLBN","JESH","RACL"],["RBDF","URUM","NSCH","CROD","CPET","AVBG"],["PROG|BLVL|JSTF","TRIM|STET|PRON","MANC|ADUD|JHTC","CSHL|UESH|ETZE","JVRL|ECBT|CLMC","WALF","CMLB"]);
	loadSeason("1920-21",["JESH","FOLA","HLBN","SDUD","RBDF","SCLX","RACL","URUM"],["TRIM","NSCH","CROD","PROG","CPET","JSTF","AVBG","BLVL"],["STET","UESH","PRON","CSHL","ADUD","MANC","ETZE","JHTC"],["RBPF|ECBT|FCOB","ASLX|USDD|OYMP","JWAS|IESH|BBOY","JVRL|ENFM|HAGN","MERL|JMON|YBSL","SWFT|JSNM"]);

	let t1d = "M45,69";
	let t2d = "M95,69";
	let t3d = "M105,69";
	let t4d = "M155,69";
	let t5d = "M275,69";
	let t6d = "M595,69";

    leagueSizes.forEach(s=>{

		const one = s.length >= 1 ? s[0] : null;
		const two = s.length >= 2 ? one + s[1] : null;
		const three = s.length >= 3 ? two + s[2] : null;
		const four = s.length >= 4 ? (three + s[3]) : null;
		const five = s.length >= 5 ? (four + s[4]) : null;
		const six = s.length >= 6 ? (five + s[5]) : null;

		let onePos = one*positionHeight
		t1d += "v" + onePos + "h10v-" + onePos + "h-10h10";

		if ( two !== null ) {
			let twoPos = two*positionHeight;
			t2d += "v" + twoPos + "h10v-" + twoPos + "h-10h10";
		}

		if ( three !== null ) {
			let threePos = three*positionHeight;
			t3d += "v" + threePos + "h10v-" + threePos + "h-10h10";
		}

		if ( four !== null ) {
			let fourPos = four*positionHeight;
			t4d += "v" + fourPos + "h10v-" + fourPos + "h-10h10";
		}

		if ( five !== null ) {
			let fivePos = five*positionHeight;
			t5d += "v" + fivePos + "h10v-" + fivePos + "h-10h10";
		}

		if ( six !== null ) {
			let sixPos = six*positionHeight;
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
    const focus = club.toUpperCase();
    const team = clubs[focus];
    const teamName = window.allTeams[focus].name;
	let start = 50;
	const p0 = 73 - positionHeight;
	let line = "";
	let started = false;
	let current = p0;
	let gap = 10;
	let consecutive = 0;
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
			let place = p0 + (position*positionHeight);
			let diff = place - current;
			if ( gap === 10 ) {
				if ( started ) {
					line += "l10,"+diff;
				} else {
					line += "M"+start+","+place;
					started = true;
				}
			} else {
				line += "m"+gap;
				line += ","+diff;
				gap = 10;
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
    let thisLeagueSize = [
        level1.length,
        level2.length,
        level3.length,
        level4.length,
        level5.length,
        level6.length
    ];
    thisLeagueSize = thisLeagueSize.filter(key => key !== 0);
    leagueSizes.push(thisLeagueSize);
    let p = 1;
    [...level1,...level2,...level3,...level4,...level5,...level6].forEach(cc=>{
        cc.split("|").forEach(c=>{
            if ( ! clubs[c] ) {
                clubs[c] = [];
                for ( let i=1 ; i<=seasonCount ; i++ ) {
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