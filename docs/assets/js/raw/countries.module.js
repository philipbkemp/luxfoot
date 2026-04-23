let params={};
window.location.search.replace("?","").split("&").forEach(param=>{const parts=param.split("=");params[parts[0]]=parts[1];});
const mode = params.comp ?? "M";

const dataContainer = document.getElementById("dataContainer");

let countries = [];

const compNav = document.getElementById("competitions");

try {
    const rTeams = await fetch("data/teams.json");
    doneFetch(await rTeams.json());
} catch (error) {
    handleError(error);
}

function doneFetch(data) {
    Object.keys(data).forEach(t=>{
        if ( t.startsWith("_") && data[t].matches ) {
            let thisCountry = data[t];
            thisCountry.code = t.replace("_","");
            countries.push(thisCountry);
        }
    });

    let br = document.createElement("BR");
    dataContainer.append(br);

    let divClubs = document.createElement("UL");
    divClubs.id = "seasonlist";
    divClubs.classList.add("no-margin");

    countries
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .forEach(ctry=>{
        let clubLi = document.createElement("LI");
        let clubLink = document.createElement("A");
        clubLink.innerHTML = ctry.name;
        clubLink.setAttribute("href","country.html?country="+ctry.code);
        clubLi.append(clubLink);
        divClubs.append(clubLi);
    });
    dataContainer.append(divClubs);
}
