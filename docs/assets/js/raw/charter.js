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
	loadSeason("1921-22",["FOLA","HLBN","JESH","SCLX","SDUD","RBDF","TRIM","NSCH"],["RACL","STET","URUM","CROD","CPET","PROG","UESH","JSTF"],["RBPF","ECBT","PRON","ADUD","BLVL","CSHL","AVBG","MANC"],["JWAS|USDD|JHTC|YBDK","RPDN|FCOB|HAGN|MARM","ASLX|JKYL|BBOY|MINL","WALF|ASDF|PHLK|ETZE","JVRL|YBSL|OYMP|GOLD","MERL|IESH|UBEK|USND","SWFT|JMON","SGRV|ENFM"]);
	loadSeason("1922-23",["RBDF","SDUD","FOLA","JESH","HLBN","SCLX","RACL","STET"],["RBPF","ECBT","PROG","URUM","TRIM","CROD","NSCH","CPET"],["RPDN|USDD|PRON","JVRL|MANC|FCOB","YBDK|ADUD|UESH","CSHL|MARM|BLVL","JWAS|AVBG|JHTC"],["ASLX|ETZE|ASDF|JKYL","SGRV|GOLD|IESH|ROLG","RIEF|MINL|OYMP|HOPB","SWFT|BBOY|WALF"]);
	loadSeason("1923-24",["FOLA","SPOR","RBDF","JESH","SDUD","HLBN","RBPF","ECBT"],["PROG","USDD","STET","URUM","PRON","CROD","RPDN","TRIM"],["YBDK|MANC|UESH","ETZE|ADUD|BLVL","ASLX|NSCH|CPET","SGRV|JKYL|ASDF","CSHL|JVRL|FCOB"],["MINL|AVBG|ARIS","RIEF|JHTC|SWFT","GOLD|UNAS|AZST","JWAS|OYMP|RSSW","SPST|ESLX","DARE"]);
	loadSeason("1924-25",["SPOR","SDUD","JESH","FOLA","RBDF","HLBN","PROG","USDD"],["RBPF","UESH","ECBT","YBDK","CROD","PRON","URUM","STET"],["ARIS|ADUD|ASDF","AVBG|MANC|JKYL","ASLX|RIEF|CPET","ETZE|NSCH|RPDN","GOLD|SWFT|BLVL"],["OYMP|CSHL","JHTC|UNAS","SPST|SGRV","USND|JVRL","ESLX|AZST","RSSW"]);
	loadSeason("1925-26",["RBDF","SPOR","FOLA","JESH","ULUX","RBPF","SDUD","UESH"],["ARIS","PRON","ASDF","PROG","YBDK","USDD","CROD","ECBT"],["JKYL|CPET|AVBG","URUM|RPDN|ETZE","ADUD|OYMP|ASLX","NSCH|CSHL|GOLD","STET|UNAS|MANC"],["DARE|BLVL","AZST|SPST","USND|FCOB","WALF|SWFT","JHTC"])
	loadSeason("1926-27",["ULUX","RBDF","SPOR","JESH","FOLA","RBPF","ARIS","PRON"],["SDUD","PROG","ASDF","USDD","YBDK","CPET","AVBG","UESH"],["NSCH|MANC","CROD|UNAS","URUM|ECBT","ADUD|ETZE","CSHL|ASLX","JKYL|RPDN","BLVL|GOLD","OYMP|DARE"],["ESLX|SWFT","USND|STET","WALF|JHTC","MINL|SPST","JWIL"]);
	loadSeason("1927-28",["SPOR","SDUD","RBDF","RBPF","JESH","FOLA","PROG","ULUX"],["ASDF","PRON","ARIS","NSCH","CPET","USDD","MANC","YBDK"],["SWFT|ADUD","ETZE|URUM","AVBG|JKYL","ASLX|CROD","UNAS|CSHL","GOLD|STET","RPDN|UESH","OYMP|ESLX"],["USND|SPST","MINL|EGWM","MARM|JHTC","JWIL|WALF","EITZ"]);
	loadSeason("1928-29",["SPOR","FOLA","RBDF","JESH","PRON","RBPF","ASDF","SDUD"],["ULUX","USDD","ARIS","PROG","NSCH","ADUD","CPET","SWFT"],["SPST|URUM","AVBG|UESH","ETZE|UNAS","YBDK|CROD","EGWM|STET","GOLD|ASLX","USND|JKYL","MANC|RPDN"],["OYMP","WALF","JHTC","MARM","JWIL","RSML"]);
	loadSeason("1929-30",["FOLA","SPOR","RBDF","PRON","RBPF","ULUX","USDD","JESH"],["NSCH","SDUD","ASDF","ARIS","URUM","PROG","ADUD","SPST"],["EGWM|STET","YBDK|CPET","ETZE|SWFT","AVBG|UESH","GOLD|CROD","USND|UNAS","WALF|JKYL","OYMP|ASLX"],["RSML|BLVL","DARE|SCBT","RPDN|JHTC","JWAS|MARM","CSHL|UBSH","MANC|WGLW","MINL"]);
	loadSeason("1930-31",["RBDF","SPOR","PRON","FOLA","ULUX","NSCH","SDUD","RBPF"],["USDD","ARIS","PROG","JESH","ASDF","URUM","STET","EGWM"],["AVBG|ADUD","CPET|BLVL","SPST|CROD","GOLD|UNAS","USND|RSML","YBDK|SWFT","WALF|JKYL","ETZE|UESH"],["SCBT|JWAS|MANC","RPDN|CGRV|CSOB","MINL|ASLX|JHTC","WGLW|DARE|UBSH","MDLB|CSHL|OYMP","MARM|TRIM"]);
	loadSeason("1931-32",["RBDF","PRON","SPOR","ULUX","NSCH","FOLA","USDD","ARIS"],["SDUD","RBPF","PROG","JESH","ASDF","ADUD","URUM","AVBG"],["SCBT|BLVL","CPET|CROD","GOLD|SWFT","YBDK|JKYL","SPST|STET","USND|JWAS","EGWM|RSML","WALF|UNAS"],["CSOB|AREM|ETZE|CGRV","JHTC|TRIM|RPDN|DARE","UESH|MDLB|UBSH|UMRT","MANC|RBAS|MARM|VICR","CSHL|ECBT|WGLW","OYMP|ASLX|MINL"]);
	loadSeason("1932-33",["RBDF","SPOR","PRON","FOLA","NSCH","ULUX","SDUD","RBPF"],["USDD","JESH","ARIS","ASDF","ADUD","PROG","BLVL","SCBT"],["CROD","URUM","CPET","YBDK","SWFT","AVBG","GOLD","JKYL"],["RSML|JWAS","AREM|TRIM","STET|CGRV","CSOB|ETZE","UBSH|SPST","RPDN|USND","JHTC|DARE","UESH|EGWM"],["UMRT|CSHL","ASLX|JMAM","WWMP|UNAS","VICR|RBAS","WALF|MANC","MARM|MDLB","WGLW|OYMP","MINL|ESHW"]);
	loadSeason("1933-34",["SPOR","RBDF","USDD","ULUX","JESH","PRON","NSCH","FOLA"],["RBPF","ARIS","SDUD","ASDF","ADUD","CROD","PROG","URUM"],["CPET","AVBG","BLVL","JWAS","SWFT","RSML","YBDK","SCBT"],["TRIM|CSOB","CSHL|STET","ASLX|AREM","USND|MAMR","ETZE|JKYL","GOLD|CGRV","UBSH|RPDN","SPST|UMRT"],["DARE|RBAS|MANC","VICR|UNAS|EGWM","WWMP|BBML|RROD","MARM|MDLB|JHTC","MINL|UESH|ESHW","KOPS|LLMP|OYMP"]);
	loadSeason("1934-35",["SPOR","RBDF","JESH","USDD","RBPF","ULUX","ARIS","PRON"],["FOLA","ASDF","NSCH","SDUD","CPET","CROD","ADUD","AVBG"],["BLVL","URUM","TRIM","PROG","CSOB","JWAS","RSML","SWFT"],["EGWM|CSHL","ASLX|STET","MANC|AREM","DARE|RBAS","YBDK|SCBT","USND|MAMR","ETZE|CGRV","GOLD|JKYL"],["GSWW|WALF|MDLB|RROD|RPDN","AWDG|MARM|UESH|JHTC|UNAS","WWMP|JGIL|UMRT|MOND|BBML","TSVG|MINL|BOUS|SPST|KOPS","SURA|SCHR|VICR|UBSH|SBRT","AHOS|WRMC|BECH|OYMP|LLMP","JSCV|ESHW|JGOB","LAHD"]);
	loadSeason("1935-36",["SPOR","JESH","RBDF","USDD","FOLA","ULUX","RBPF","ARIS","ASDF","NSCH"],["PRON","SDUD","CROD","CPET","AVBG","URUM","BLVL","ADUD","TRIM","PROG"],["AREM","STET","MANC","CSOB","EGWM","ASLX","RBAS","JWAS","CSHL","RSML"],["UESH|YBDK","RPDN|USND","SCBT|SPST","BBML|GOLD","RROD|CGRV","MAMR|WALF","SWFT|DARE","UNAS|MARM","MDLB|AWDG","MOND|GSWW"],["JGIL|UBSH|ETZE","LLMP|JKYL|WRMC","VICR|DRZV|MINL","UMRT|SBRT|TSVG","OBCN|KOPS|ASTN","FRTA|OYMP|WWMP","BECH|JGOB|SCHR","ESHW|SURA","HOBS"]);
	loadSeason("1936-37",["JESH","PRON","USDD","SDUD","RBDF","SPOR","FOLA","ULUX","RBPF","ARIS"],["ASDF","NSCH","CROD","AREM","AVBG","URUM","STET","MANC","CPET","BLVL"],["ADUD","USND","RPDN","YBDK","ASLX","UESH","PROG","CSOB","EGWM","TRIM"],["SCBT|BBML","CSHL|ETZE","RROD|GOLD","MAMR|JWAS","UBSH|JGIL","SPST|DARE","SWFT|LLMP","JKYL|WALF","RBAS|CGRV","RSML|MINL"],["MARM|RUPL|ASCH","UNAS|FRTA|DRZV","AWDG|KOPS|OYMP","SBRT|UMRT|MDLB","SCHR|VICR|JGOB","ASTN|JUNG|HOBS","TSVG|OBCN|ESHW","UWLD|MOND"]);
	loadSeason("1937-38",["SPOR","JESH","SDUD","USDD","PRON","ULUX","FOLA","NSCH","ASDF","RBDF"],["AVBG","CROD","ADUD","ARIS","RBPF","RPDN","STET","USND","URUM","AREM"],["YBDK","BBML","CPET","SCBT","MANC","ETZE","UESH","ASLX","BLVL","CSHL"],["RROD|JWAS","CSOB|GOLD","ASCH|TRIM","UBSH|EGWM","SWFT|DARE","PROG|LLMP","UNAS|UMRT","SPST|RUPL","MAMR|JGIL","DRZV|MARM"],["CGRV|JKYL|WALF","VICR|KOPS|TSVG","MDLB|OYMP|RSML","RBAS|ESHW|AWDG","FRTA|SBRT|SAND","JUNG|JKGB|OVND","UWLD|HRTB|ASTN","HOBS|MINL"]);

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