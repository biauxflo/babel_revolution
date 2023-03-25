
// introToDecree / reactToDecree / acceptDecree

//current et next sont des id (#...)
function nextPageIntro(current, next) {

    let currentDiv = d3.select(current);
    let nextDiv = d3.select(next);

    currentDiv.style("display", "none")
    nextDiv.style("display", "block")

}

function removeIntro() {
    let divIntro = d3.select("#text-box-intro")
    let divTextBox = d3.select("#text-box") //partie de droite

    divIntro.style("display", "none")
    divTextBox.style("display", "flex")
}