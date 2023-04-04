var cpt = 0;

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

    

    //react = true or false
    //to do : gestion du react

    console.log("react : "+react)
    
    switch(decree) { //decree = '1' ou '2' ou '3'
        case '1' :
            console.log("Premier décret - graphe")
            buttonsToShow(toShow="#button-decree2", toRemove1="#button-decree3", toRemove2="#button-end")
            break;
        case '2' :
            console.log("Deuxième décret - graphe")
            buttonsToShow(toShow="#button-decree3", toRemove1="#button-decree2", toRemove2="#button-end")
            break;
        case '3' :
            console.log("Troisitème décret - graphe")
            buttonsToShow(toShow="#button-end", toRemove1="#button-decree2", toRemove2="#button-decree3")
            break;
        default :
            //si erreur ou changement manuelle -> retour à l'intro
            console.log("Paramètre inconnu - redirection introduction")
            window.location.href = 'index.html'
    }
}

//gestion des boutons - paramètres = #id
function buttonsToShow(toShow, toRemove1, toRemove2) {
    let buttonToShow = d3.select(toShow);
    let buttonToRemove1 = d3.select(toRemove1);
    let buttonToRemove2 = d3.select(toRemove2);

    buttonToShow.style("display", "block")
    buttonToRemove1.style("display", "none")
    buttonToRemove2.style("display", "none")

}

function onLoadStory() {
    // ex of URL : index.html?decree=2

    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    var decree = decodeURI(temp[1]);

    let introDiv = d3.select("#intro");
    
    switch(decree) { //decree = '2' ou '3'
        case '2' :
            console.log("Deuxième décret - lecture")
            let secondDecreeDiv = d3.select("#secondDecree");
            secondDecreeDiv.style("display", "block")
            introDiv.style("display", "none")
            break;
        case '3' :
            console.log("Troisitème décret")
            let thirdDecreeDiv = d3.select("#thirdDecree");
            thirdDecreeDiv.style("display", "block")
            introDiv.style("display", "none")
            break;
        default :
    }
}