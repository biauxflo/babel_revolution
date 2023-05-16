function toggle(idButton, idDiv) {
    div = document.getElementById(idDiv)

    if(div.style.display == "none") { //display
        d3.select("#"+idDiv).style("display", "block")
        d3.select("#"+idButton).classed("button-toggle-down", false)
        d3.select("#"+idButton).classed("button-toggle-up", true)
    }
    else { //hide
        d3.select("#"+idDiv).style("display", "none")
        d3.select("#"+idButton).classed("button-toggle-up", false)
        d3.select("#"+idButton).classed("button-toggle-down", true)
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