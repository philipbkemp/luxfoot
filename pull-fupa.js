// https://api.fupa.net/v1/competitions/ehrenpromotion-luxemburg/seasons/current/matches?to=2025-07-01&sort=desc&limit=100


allTeams = {
    "Alliance Dudelange": "ADUD","Avenir Flaxweiler": "AFLX","Arantia Berdorf": "ARBD","AS Remich": "AREM","Aris Bonnevoie": "ARIS","AS Schifflange": "ASCH",
    "AS Differdange": "ASDF","AS Luxembourg": "ASLX","Alisontia Steinsel": "ASTN","Atert Bissen": "ATBS","Avenir Beggen": "AVBG","Arminia Weidingen": "AWDG",
    "Blue Boys Muhlenbach": "BBML","Blo-Giel Hupperdange": "BGHP","FC Bigonville": "BGNV","The Belval Belvaux": "BLVL","US Bous": "BOUS","FC Brouch": "BRCH",
    "US Boevange/Attert": "BVAT","Blo-Wäiss Itzig": "BWIT","Blo-Wäiss Medernach": "BWMD","CS Echternach": "CECH","CS Grevenmacher": "CGRV","ES Clemency": "CLMC",
    "Claravallis Clervaux": "CLVX","CS Mondorf-les-Bains": "CMLB","CS Hollerich": "CSHL","CS Petange": "CPET","Chiers Rodange": "CROD","CS Oberkorn": "CSOB",
    "Daring Club Echternach": "DARE","Eclair Bettembourg": "ECBT","Etoile Bleu Dudelange": "EBDU","Egalité Weimerskirch": "EGWM","FC Ehlerange": "EHLR",
    "Etoile Rouge 1908 Dudelange": "ERDU","ES Schouweiler": "ESHW","Etoile Sportive Luxembourg": "ESLX","Etzella Ettelbréck": "ETZE","FC Oberkorn": "FCOB",
    "Fola Esch": "FOLA","Forta Beaufort": "FRTA","Gold a Ro't Wiltz": "GOLD","Green Star Wilwerdingen": "GSWW","FC Hamm 37": "HAMM","US Hollerich/Bonnevoie": "HLBN",
    "CS Hobscheid": "HOBS","US Hostert": "HOST","FC Hupperdange": "HUPP","Jeunesse Bettembourg": "JBET","Jeunesse Biwer": "JBIW","Jeunesse Esch": "JESH",
    "Jeunesse Gilsdorf": "JGIL","Jeunesse Heisdorf": "JHSD","Jeunesse Hautcharage": "JHTC","Jeunesse 07 Kayl": "JKYL","Jeunesse Ospern": "JOSP",
    "Jeunesse Schieren": "JSCH","Jeunesse Sportive Koerich": "JSKH","Jeunesse Steinfort": "JSTF","Jeunesse Junglinster": "JUNG","Jeunesse Useldange": 
    "JUSE","Jeunesse Verlorenkost": "JVRL","Jeunesse Wasserbillig": "JWAS","Jeunesse Weimerskirch": "JWMK","Jeunesse Wilwerdingen": "JWIL","FC Kehlen": "KHLN",
    "FC Knaphoscheid/Selscheid": "KNAP","FC Kopstal 33": "KOPS","Kiischpelt Wilwerwiltz": "KPWW","Koeppchen Wormeldange": "KWRM","Les Ardoisiers Perlé": "LARD",
    "FC Lorentzweiler": "LRNZ","Luna Oberkorn": "LUNA","Mamer 32": "MAMR","Mansfeldia Clausen": "MANC","Marisca Mersch": "MARM","FC Mondercange": "MDCG",
    "US Mondorf-les-Bains": "MDLB","Les Montagnards Weiswampach": "MGWW","Minerva Lintgen": "MINL","Minière Lasauvage": "MLSV","Sporting Mertzig": "MRTZ",
    "National Schifflange": "NSCH","Old Boys Consdorf": "OBCN","Orania Vianden": "OVND","Olympia Christnach/Waldbillig": "OYCW","Olympique Äischen": "OYMP",
    "Phalanx Kleinbettingen": "PHLK","AS Pratzerthal": "PRTZ","Progrès Grund": "PROG","Progrès Niederkorn": "PRON","Racing Club Luxembourg": "RACL",
    "Red Boys Aspelt": "RBAS","Red Boys Differdange": "RBDF","Red Black Pfaffenthal": "RBPF","US Reisdorf": "REIS","Racing Heiderscheid": "RHDS",
    "Ro'de Le'w Consthum": "RLCN","CS Rollingergrund": "ROLG","Rapid Neudorf": "RPDN","Racing Rodange": "RROD","Red Star Merl": "RSML","Rupensia Larochette": "RUPL",
    "US Sandweiler": "SAND","Sporting Bertrange": "SBRT","Sporting Club Bettembourg": "SCBT","Sporting Club Luxembourg": "SCLX","SC Differdange": "SDIF",
    "Stade Dudelange": "SDUD","Saint Michel Oberpallen": "SMOB","CS Sanem": "SNEM","Spora Luxembourg": "SPOR","Sporting Steinfort": "SPST","SC Rédange": "SRED",
    "SC Tétange": "STET","Sura Esch/Sauer": "SURA","Swift Hesperange": "SWFT","Syra Mensdorf": "SYRA","Titus Lamadelaine": "TLMD","Tricolore Gasperich": "TRIG",
    "Tricolore Muhlenweg": "TRIM","Racing Troisvierges": "TSVG","US Bascharage": "UBSH","US Esch": "UESH","US Feulen": "UFLN","Union Luxembourg": "ULUX",
    "US Mertert": "UMRT","US Rumelange": "URUM","US Dudelange": "USDD","US Moutfort/Medingen": "USMM","US Niederwiltz": "USND","Victoria Rosport": "VICR",
    "Résidence Walferdange": "WALF","FC Wiltz 71": "WLTZ","FC Weiswampach": "WWMP","Young Boys Diekirch": "YBDK","Yellow Boys Weiler-la-Tour": "YBWT",
    "Red Star Merl/Belair":"RSMB","AS Hosingen":"AHOS","AS Colmar-Berg":"ASCB","Les Aiglons Dalheim":"LADH","FC Erpeldange 72":"ERPL","Jeunesse Canach":"JCNC",
    "FC Munsbach":"MUNS","CS Bourscheid":"CBSH","FC Harlange":"HARL","Tarwat Tarchamps":"TWTC","GB Harlange/Tarchamps":"GBHT","UNA Strassen":"UNAS",
    "Vinesca Ehnen":"VINE","FC Beyren-Udinesina":"BYUD","Yougo Grund-Cessange":"YGGC","Progrès Cessange":"PROC","Berdenia Berbourg": "BDBB",
    "Amis de la Moselle Remerschen":"AMRS","FC Noertzange HF":"NORZ","US Folschette":"FOLS","AS Wincrange":"WINC","FC 47 Bastendorf":"BAST","Excelsior Grevels":"EXGV",
    "SC Ell":"SELL","Iska Boys Simmern":"ISKA","RM 86 Luxembourg":"RMLX","Racing Heiderscheid/Eschdorf":"RHSE","US Rambrouch":"RAMB","Sporting Beckerich":"SBCK",
    "FC Rodange 91": "RODG", "F91 Dudelange": "F91D","Etzella Ettelbruck": "ETZE","The National Schifflange":"NSCH", "Union Mertert/Wasserbillig":"UNMW",
    "Schifflange 95":"SCHF", "UN Käerjéng 97":"KAER","Rupensia Lusitanos Larochette":"RPLL","FC Differdange 03":"DIFF","Blo-Weiss Medernach":"BWMD",
    "Union 05 Kayl/Tétange": "U5KT","FF Norden 02":"NORD","Alliance Aischdall H/E":"AAHE","Union Remich/Bous":"UNRB","Racing Union":"RACE","RM Hamm Benfica":"BENF",
    "Red Boys Differdingen": "RBDF","Union Luxemburg":"ULUX", "Spora Luxemburg":"SPOR","Stade Düdelingen":"SDUD","The National Schifflingen":"NSCH",
    "Alliance Düdelingen":"ADUD", "F 91 Düdelingen": "F91D", "FC Monnerich": "MDCG", "Aris Bonneweg": "ARIS", "CS Petingen": "CPET", "US Rümelingen": "URUM",
    "US Düdelingen": "USDD", "Etzella Ettelbrück": "ETZE", "US Hollerich/Bonneweg": "HLBN", "Sporting Club Luxemburg": "SCLX", "Racing Club Luxemburg": "RACL",
    "FC Differdingen 03": "DIFF", "FC RM Hamm Benfica": "RMHM", "RFCU Luxemburg": "RACE", "Swift Hesperingen": "SWFT", "AS Luxemburg": "ASLX","AS Schifflingen": "ASCH",
    "Olympique Eischen": "OYMP", "Etoile Sportive Schouweiler": "ESHW", "Etoile Sportive Clemency": "CLMC", "Blo-Weiss Itzig": "BWIT", "Cessange FC": "CESS",
    "K. Wormeldange": "KWRM", "Remich/Bous": "UNRB", "U. Kayl/Tétange": "U5KT", "Mertert/Wasserb.": "UNMW", "Rés. Walferdange": "WALF", "Red Black/Egalité": "RBE7",
    "FC Schengen": "SHGN", "RS Merl/Belair": "RSMB", "FC Red Black/Egalité 07": "RBE7", "Sporting Schouweiler": "ESHW", "AS Differdingen": "ASDF",
    "Diables Rouges Zolver": "DRZV", "Una Strassen": "UNAS","FC Mamer 32": "MAMR", "Kischpelt Wilwerwiltz": "KPWW", "Rac. Heiderscheid/Eschdorf": "RHSE",
    "FC Pratzerthal/Redange": "FCPR", "SC Differdingen": "SDIF", "FC Cebra 01": "CBRA", "FC Flaxweiler/Beyren": "FBU1", "Les Amis de la Moselle Remerschen": "AMRS",
    "FC 72 Erpeldingen": "ERPL", "Blue-Boys Muhlenbach": "BBML", "US Berdorf/Consdorf": "USBC", "FC Schifflingen 95": "SCHF", "Alliance 01 Luxemburg": "ALLX",
    "RM 86 Luxemburg": "RMLX", "SC Bettembourg": "SCBT", "Titus Petingen": "UNTP", "Vistoria Rosport": "VICR", "US Mondorf": "MDLB", "FC Luxemburg City": "LUXC",
    "FC Koeppchen": "KOEP", "Rupensia Lusit. Larochette": "RPLL", "R. Heiderscheid/Eschdorf": "RHSE", "Ol. Christnach/Waldbillig": "OYCW", "FC Biekerech": "BIEK",
    "Pratzerthal/Rédange": "FCPR", "JS Koerich": "KOSM", "Union Mertert/Wasser.": "UNMW", "Flaxweiler/Beyren": "FBU1", "Green Boys Harlange/Tarchamps": "GBHT",
    "AS Luxemburg/Porto": "ASLX", "FC Koerich": "KOSM","FC Stengefort":"STNG","AS Colmar/Berg":"ASCB","Jeunesse Junglinstert":"JUNG","Union Titus Petingen":"UNTP",
    "FC Beyren": "BYUD", "US Eschdorf": "UEDF", "Mansfeldia Clausen-Cents": "MANC","Sporting Club Steinfort":"SPST","Young Boys Schweicherthal":"YBSW",
    "Black Boys Bascharage": "BBOY", "FC Obercorn": "FCOB","Jeunesse Sportive Sanem":"JSNM", "US Hagen": "HAGN", "Young Boys Zolver": "YBSL",
    "The International Esch": "IESH", "Enfants de la Source Mondorf": "ENFM", "Jeunesse Monnerich":"JMON","Jeunesse Mondercange":"JMON","US Merl":"MERL",
    "Stade Mosellan Grevenmacher":"SGRV","Union Beckerich":"UBEK","Alzetta Cruchten":"ALCR","FC Käerch":"KOSM","Alliance Aischdall Hobscheid/Eischen":"AAHE",
    "Daring Echternach":"DARE","FC Red Black Pfaffenthal":"RBPF","Racing FC Union Luxemburg":"RACE","Ro'de Le'w Niederdonven":"RLND","CS Greiveldange":"GRIV",
    "Fortuna Canach":"FCNC","Jeunesse Flaxweiler":"JFLX","FC Marisca Mersch":"MARM","UN Käerjeng 97":"KAER","FC Jeunesse Canach":"JCNC","FC Alisontia Steinsel":"ASTN",
    "FC Atert Bissen":"ATBS","FC Résidence Walferdingen":"WALF","Fc Berdenia Berbourg":"BDBB","FC Etzella Ettelbrück":"ETZE","FC Avenir Beggen":"AVBG",
    "FC Luxembourg City":"LUXC","FC Blo-Wäiss Medernach":"BWMD","FC Orania Vianden":"OVND","FC AS Hosingen":"AHOS","FC Jeunesse Gilsdorf":"JGIL",
    "FC Sporting Mertzig":"MRTZ","FF Norden 02 Weiswampach-Hüpperdingen":"NORD","FC Alliance Äischdall Hobscheid-Eischen":"AAHE","FCM Young Boys Diekirch":"YBDK",
    "FC Jeunesse Schieren":"JSCH","FC Jeunesse Useldingen":"JUSE","FC Syra Mensdorf":"SYRA","FC Ehleringen":"EHLR","Union 05 Kayl-Tetingen":"U5KT",
    "FC Yellow Boys Weiler-zum-Turm":"YBWT","US Berdorf-Consdorf 01":"USBC","FC Red Star Merl-Belair":"RSMB","FC Jeunesse Junglinster":"JUNG",
    "Union Remich-Bous":"UNRB","FC Blo-Wäiss Itzig":"BWIT","FC The Belval Beles":"BLVL","US Reisdorf 47":"REIS","FC Racing Heiderscheid-Eschdorf":"RHSE",
    "AS Rupensia Lusitanos Fels":"RPLL","FC Pratzerthal-Redingen":"FCPR","FC Olympia Christnach-Waldbillig":"OYCW","FC Green Boys 77 Harlingen-Ischpelt":"GBHT",
    "FC Racing Ulflingen":"TSVG","FC Minerva Lintgen":"MINL","US Böwingen/Attert":"BVAT","AS Wintger":"WINC","FC Minière Lasauvage":"MLSV","FC Nörtzingen H.F.":"NORZ",
    "Étoile Sportive Schouweiler":"ESHW","AS Lëtzebuerg-Fëschmaart":"ASLX","US Moutfort-Medingen":"USMM","Sporting Bartringen":"SBRT",
    "Union Mertert-Wasserbillig":"UNMW","FC Les Aiglons Dalheim":"LADH","FC Tricolore Gasperich":"TRIG","Étoile Sportive Küntzig":"CLMC","FC Beckerich":"BIEK",
    "FC Les Ardoisiers Perlé":"LARD","Claravallis Clerf":"CLVX","FC Excelsior Grevels":"EXGV","FC Red Boys Uespelt":"RBAS","FC Kiischpelt Wilwerwiltz":"KPWW"
};
matches = [];
ids = [];
season = prompt("Which season?");
competition = {
    type: "league",
    level: prompt("League level"),
    name: prompt("League name")
};
series = prompt("League Series");
if ( series !== "" ) {
    competition.series = series;
}
console.clear();
one.forEach(m=>{    if ( ! ids.includes(m.id ) ) { ids.push(m.id); matches.push(buildMatch(m)); } });
two.forEach(m=>{    if ( ! ids.includes(m.id ) ) { ids.push(m.id); matches.push(buildMatch(m)); } });
three.forEach(m=>{  if ( ! ids.includes(m.id ) ) { ids.push(m.id); matches.push(buildMatch(m)); } });
function buildMatch(m) {
    home = m.homeTeam.club.name;
    if ( ! allTeams[home] ) { console.error(home); } else { home = allTeams[home]; }
    away = m.awayTeam.club.name;
    if ( ! allTeams[away] ) { console.error(away); } else { away = allTeams[away]; }
    score = m.homeGoal + "-" + m.awayGoal;
    d = new Date(m.kickoff);
    date = d.getFullYear() + "-" + (d.getMonth()+"").padStart(2,"0") + "-" + (d.getDate()+"").padStart(2,"0")
    return {
        home: home,
        away: away,
        score: score,
        season: season,
        competition: competition,
        date: date
    };
}
console.log(JSON.stringify(matches).replaceAll("},{","},\n{"));