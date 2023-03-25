
// introToDecree / reactToDecree / acceptDecree

//current et next sont des id (#...)
function nextPageIntro(current, next) {

    let currentDiv = d3.select(current);
    let nextDiv = d3.select(next);

    currentDiv.style("display", "none")
    nextDiv.style("display", "block")

}

function toMain() {
    let divIntro = d3.select("#text-box-intro")
    let divMain = d3.select("#main")

    divIntro.style("display", "none")
    //divMain.style("display", "flex")
}