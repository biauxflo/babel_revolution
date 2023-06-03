function toggle(idSpan, idDiv) {
    div = document.getElementById(idDiv)

    if(div.style.display == "none") { //display
        d3.select("#"+idDiv).style("display", "block")
        d3.select("#"+idSpan).html("⇧")
    }
    else { //hide
        d3.select("#"+idDiv).style("display", "none")
        d3.select("#"+idSpan).html("⇩")
    }
    
}

function toggle_simple(idDiv) {
    div = document.getElementById(idDiv)

    if(div.style.display == "none") { //display
        d3.select("#"+idDiv).style("display", "block")
    }
    else { //hide
        d3.select("#"+idDiv).style("display", "none")
    }
    
}