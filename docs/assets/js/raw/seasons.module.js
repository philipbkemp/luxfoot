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
        link.href = "season.html?year="+s;
        link.textContent = s;
        li.append(link);
        ul.append(li);
    });
}