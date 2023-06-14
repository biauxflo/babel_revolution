//current et next sont des id (#...)
function nextPageIntro(current, next) {

    let currentDiv = d3.select(current);
    let nextDiv = d3.select(next);

    currentDiv.style("display", "none")
    nextDiv.style("display", "block")

}

//fonction onload de la page graph.html
function onLoadGraph() {
    // ex of URL : /session/39?intro

    var parameter = location.search.substring(1).split("?");
    if(parameter == "intro") {
        d3.select("#text-box-intro").style("display", "block");
    }
    else {
        d3.select("#main").style("display", "block");
    }
}