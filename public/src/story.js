//current et next sont des id (#...)
function nextPageIntro(current, next) {

    let currentDiv = d3.select(current);
    let nextDiv = d3.select(next);

    currentDiv.style("display", "none")
    nextDiv.style("display", "block")

}

//fonction onload de la page graph.html

//gestion de l'affichage des noeuds avec les décrets déjà lus + boutons
function onLoadGraph() {
    // ex of URL : graph.html?decree=2&react=true

    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    var decree = decodeURI(temp[1]);

    if(parameters.length > 1) {
        temp = parameters[1].split("=");
    var react = decodeURI(temp[1]);
    }

    if(react == "true") {
        //open side bar
        d3.select("#messages-inside").style("display", "block")
        d3.select("#span-toggle-messages").html("⇧")

        //open message box
        //open side bar & message box
        d3.select("#add-node-form").style("display", "block")
        d3.select("#span-toggle-writing").html("⇧")

        document.getElementById("add-node-title").focus();
    }

    
    switch(decree) { //decree = '1' ou '2' ou '3'
        case '1' :
            d3.select("#button-decree2").style("display", "block");
            break;
        case '2' :
            d3.select("#button-decree3").style("display", "block");
            break;
        case '3' :
            d3.select("#button-end").style("display", "block");
            break;
        default :
            //si erreur ou changement manuelle -> retour à l'intro
            //console.log("Paramètre inconnu - redirection introduction")
            //window.location.href = 'index.html'
            window.location.href += '?decree=1&react=false';
    }
}

function onLoadStory() {
    // ex of URL : index.html?decree=2

    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    var decree = decodeURI(temp[1]);
    
    switch(decree) { //decree = '2' ou '3'
        case '2' :
            let secondDecreeDiv = d3.select("#secondDecree");
            secondDecreeDiv.style("display", "block")
            break;
        case '3' :
            let thirdDecreeDiv = d3.select("#thirdDecree");
            thirdDecreeDiv.style("display", "block")
            break;
        default :
        d3.select("#intro").style("display", "block");
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