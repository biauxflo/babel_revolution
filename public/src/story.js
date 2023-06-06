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

function onLoadEnd() {
    let nb_decree = 3;
    let end = Math.floor(Math.random() * nb_decree); // 0, 1 ou 2
    
    switch(end) { //decree = '2' ou '3'
        case 0 :
            d3.select("#end1").style("display", "block");
            break;
        case 1 :
            d3.select("#end2").style("display", "block");
            break;
        case 2 :
            d3.select("#end3").style("display", "block");
            break;
        default :
            d3.select("#end2").style("display", "block");
    }
}