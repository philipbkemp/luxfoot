try {
    const rSeasons = await fetch("data/seasons.json");
    doneFetch(await rSeasons.json());
} catch (error) {
    handleError(error);
}

function doneFetch(data) {
    const ul = document.getElementById("seasonlist");
    data.forEach(s=>{
        let li = document.createElement("LI");
        let link = document.createElement("A");
        if ( s ) {
            link.href = "season.html?year="+s;
            link.textContent = s;
        } else {
            link.textContent = "";
            link.classList.add("spacer");
        }
        li.append(link);
        ul.append(li);
    });
}