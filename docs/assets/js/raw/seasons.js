function doneFetch(data) {
    ul = document.getElementById("seasonlist");
    data.forEach(s=>{
        li = document.createElement("LI");
        link = document.createElement("A");
        link.href = "season.html?year="+s;
        link.textContent = s;
        li.append(link);
        ul.append(li);
    });
}