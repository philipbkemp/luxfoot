season = prompt("This season",window.location.href.split("/").pop().split("_")[0].replace("%E2%80%93","-"));
next = (parseInt(season.split("-")[0])+1) + "-" + (parseInt(season.split("-")[1])+1);
prev = (parseInt(season.split("-")[0])-1) + "-" + (parseInt(season.split("-")[1])-1);
teams = prompt("Teams competiting?").toUpperCase().split(",");
rounds = prompt("Rounds","PR,R1,R2,R3").toUpperCase().split(",");
roundNames = {"PR":"Preliminary round","R1":"First round","R2":"Second round","R3":"Third round"};
s = '\t"champions_league": {\n';
s += '\t\t"name": "European Cup",\n';
s += '\t\t"season": "'+season+'",\n';
s += '\t\t"links": {\n';
s += '\t\t\t"next": "'+next+'",\n';
s += '\t\t\t"prev": "'+prev+'"\n';
s += '\t\t},\n';
s += '\t\t"teams": ["'+teams.join('","')+'"],\n';
s += '\t\t"rounds": [{\n';
rounds.forEach(r=>{
    s += '\t\t\t"key": "'+r+'",\n';
    s += '\t\t\t"name": "'+roundNames[r]+'",\n';
    s += '\t\t\t"matches": {\n';
    teams.forEach(t=>{
        opp = prompt(r+" Opponent for "+t).toUpperCase();
        if ( opp !== "" ) {
            s += '\t\t\t\t"'+t+'": [\n';
            homeFirst = prompt("Home").toUpperCase();
            awayFirst = prompt("Away").toUpperCase();
            s += '\t\t\t\t\t{"isEurope":true,"date":"'+prompt("First leg: date")+'","leg":1,"home":"'+homeFirst+'","away":"'+awayFirst+'","score":"'+prompt("First leg: score")+'","season":"'+season+'","competition":{"type":"europe","cup":"champions_league","name":"European Cup","round":"'+roundNames[r]+'","leg":1}},\n';
            s += '\t\t\t\t\t{"isEurope":true,"date":"'+prompt("Second leg: date")+'","leg":2,"home":"'+awayFirst+'","away":"'+homeFirst+'","score":"'+prompt("Second leg: score")+'","season":"'+season+'","competition":{"type":"europe","cup":"champions_league","name":"European Cup","round":"'+roundNames[r]+'","leg":2},"agg":{"score":"'+prompt("Aggregate score (Lux first)")+'","outcome":"'+prompt("Aggregate outcome","L")+'","team":"'+t+'"}}\n';
            s += '\t\t\t\t]\n';
        }
    });
    s += '\t\t\t}\n';
});
s += '\t\t}]\n';
s += '\t}';
console.clear();
console.log(s);