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
export function displayNodeText(node, nodeDiv) {
    node.on("mouseover", function(event, d) {
      nodeDiv.html(d.text);
      d3.select(this).style("fill", "red");
    })
    .on("mouseout", function(d) {
      nodeDiv.html("");
      d3.select(this).style("fill", "blue");
    });
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