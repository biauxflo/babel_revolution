// Nodes initialization
export function createNodes(svg, nodes) {

    var node = svg.append("g")
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 30)
        .style("fill", "black")

    return node
}

// Displaying node text on a div
//elements-nodes
// Displaying the text and hashtags of a node on a div
export function displayNodeInfo(node, nodeTextDiv, nodeHashtagsDiv, nodeTitle, nodeAuthor) {
  //if click on graph but outside a node
  const svg = d3.select("svg");
  svg.on("click", function(event, d) {
    if(event.target.nodeName === "svg") {
      node.style("fill", "black");
      nodeTextDiv.html("");  //set text to empty to not show
      nodeTitle.html("");
      nodeAuthor.html("");
      nodeHashtagsDiv.html("");

      //close side bar
      d3.select("#messages-inside").style("display", "none")
      d3.select("#button-toggle-messages").classed("button-toggle-down", true)
      d3.select("#button-toggle-messages").classed("button-toggle-up", false)
    }
   });

  node.on("click", function(event, d) {
    let hashtags = d.hashtags.join(" / ")
    nodeTitle.html(d.title);
    nodeAuthor.html("écrit par "+d.author);
    nodeTextDiv.html(d.text);
    nodeHashtagsDiv.html("# : " +hashtags);
    d3.selectAll(".node").style("fill", "black") //reset color on all nodes
    d3.select(this).style("fill", "green");
    nodeTitle.style("display", "block") //show title, otherwise hidden

    //open side bar
    d3.select("#messages-inside").style("display", "block")
    d3.select("#button-toggle-messages").classed("button-toggle-down", false)
    d3.select("#button-toggle-messages").classed("button-toggle-up", true)
  })
  
}

  
// function tooltip_2() {
// // Créer un élément SVG pour la fenêtre contextuelle
// const tooltip = d3.select("body").append("svg")
//   .style('position', 'absolute')
//   .style('z-index', '10')
//   .style('visibility', 'hidden')
//   .style('border', '1px solid black')
//   .style('padding', '30px')
//   .style('margin', '30px')

// // Ajouter un élément texte à la fenêtre contextuelle
// tooltip.append("text")
//     .attr("id", "tooltip-text")
//     .style("position", "relative")
//     .style("font-size", "20px")
//     .style("color", "black")
//     .style('text-align', 'center')

// // Ajouter une fonctionnalité de survol pour afficher la fenêtre contextuelle
// node.on("mouseover", function(event, d) {
//         // Définir le contenu de l'élément texte de la fenêtre contextuelle
//         tooltip.select("#tooltip-text").text(d.label);
//         d3.select(this).style("fill", "red");

//         // Définir la position de la fenêtre contextuelle
//         tooltip.style("left", (d.x + 100) + "px")
//             .style("top", (d.y - 50) + "px")
//             .style("visibility", "visible");
//     })
//     .on("mouseout", function(d) {
//         // Masquer la fenêtre contextuelle
//         tooltip.style("visibility", "hidden");
//         d3.select(this).style("fill", "blue");
//     });
// }

// tooltip_2()