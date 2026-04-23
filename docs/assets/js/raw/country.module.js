const dataContainer = document.getElementById("dataContainer");
const sectionNav = document.getElementById("competitions");

let params={};
window.location.search.replace("?","").split("&").forEach(param=>{const parts=param.split("=");params[parts[0]]=parts[1];});
const country = params.country.toUpperCase();
const showSection = params.show ?? "men";
window.allTeams = [];
window.dataKeySet = [];
window.intPlayers = null;

try {
    const [rTeams,rPlayers,rCountry] = await Promise.all([
        fetch("data/teams.json"),
        fetch("data/intplayers.json"),
        fetch("data/countries/"+country.toLowerCase()+".json")
    ]);
    window.allTeams = await rTeams.json();
    window.intPlayers = await rPlayers.json();
    if ( rCountry.ok ) {
        doneFetch(await rCountry.json());
    } else {
        let errorP = document.createElement("P");
        errorP.classList.add("error");
        errorP.textContent = "Club not found";
        document.body.append(errorP);
    }
} catch (error) {
    handleError(error);
}

function doneFetch(data) {
    window.dataKeySet = [...window.dataKeySet,...Object.keys(data)];
    window.dataKeySet = [...window.dataKeySet,...Object.keys(data.matches).map(key => `matches.${key}`)];

    document.getElementsByTagName("H1")[0].innerHTML += data.name;
    document.title += " | " + data.name;
    window.dataKeySet = window.dataKeySet.filter(key => key !== 'name');

    window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches');
    if ( data.matches.men ) {
        let thisSectionNavMen = document.createElement("A");
        thisSectionNavMen.href = "country.html?country="+country+"&show=men";
        thisSectionNavMen.innerHTML = "Men's";
        let thisSectionNavLiMen = document.createElement("LI");
        thisSectionNavLiMen.append(thisSectionNavMen);
        if ( showSection === "men" ) {
            thisSectionNavMen.classList.add("active");
            drawMatches(data.matches.men,"matches.men",{type:"international"},{hasIntData:true,isSeason:false});
        }
        sectionNav.append(thisSectionNavLiMen);

        window.dataKeySet = window.dataKeySet.filter(key => key !== 'matches.men');
    }

    if ( window.dataKeySet.length !== 0 ) {
        console.error(window.dataKeySet.join(", "));
        console.log(data);
    }
}