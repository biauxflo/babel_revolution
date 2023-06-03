// Function to fetch datas of a node when using d3-hierarchy
// Node : d3-hierarchy element
// Nodes : Nodes stored in DB
export function getNodeDatas(node, nodes){
  let nodeId = node.data.data.id;
  let nodeDatas = nodes.find(z => String(z.id) === nodeId)
  return nodeDatas
}

export function getNodeColor(node) {
  if (node.type === "contribution") {
    switch (String(node.belief)) {
      case "in_favor":
        return 'red';
      case "against":
        return 'blue';
      default:
        return 'gray';
    }
  }
}

export function createNodes(svg, datas, fetchedNodes){
  let nodes = svg.append("g")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(datas)
      .join("circle")
      .style("fill", function(d){
        var datas = getNodeDatas(d, fetchedNodes);
        var color =  getNodeColor(datas);
        return color;
      })
      .attr("stroke", d => d.children ? "#fff" : null)
      .attr("r", 15);
  return nodes;
}

export function joinNodes(svg, datas, fetchedNodes){
  let nodes = svg
      .selectAll("circle")
      .data(datas)
      .join("circle")
      .style("fill", function(d){
        var datas = getNodeDatas(d, fetchedNodes);
        var color =  getNodeColor(datas);
        return color;
      })
      .attr("stroke", d => d.children ? "#fff" : null)
      .attr("r", 15);
  return nodes;
}

// Displaying node text on a div
//elements-nodes
// Displaying the text and hashtags of a node on a div
export function displayNodeInfo(nodes, node, nodeTextDiv, nodeHashtagsDiv, nodeTitle, nodeAuthor, selectReact) {
  //if click on graph but outside a node
  const svg = d3.select("svg");
  let tooltip = svg.append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

  svg.on("click", function(event, d) {
    if(event.target.nodeName === "svg") {
      node.style("fill", function(d){
        var datas = getNodeDatas(d, nodes);
        var color =  getNodeColor(datas);
        return color;
      });
      nodeTextDiv.html("");  //set text to empty to not show
      nodeTitle.html("");
      nodeAuthor.html("");
      nodeHashtagsDiv.html("");

      //close side bar
      d3.select("#messages-inside").style("display", "none")
      d3.select("#span-toggle-messages").html("⇩");
    }
   });

  node
  .on("mouseover", function(event, d){
    let nodeDatas = getNodeDatas(d, nodes);
    tooltip.text(nodeDatas.title);
    tooltip.style("visibility", "visible");
  })
  .on("mousemove", function(event, d){
    return tooltip
        .style("top",  (d3.mouse(this)[1]) + "px")
        .style("left", (d3.mouse(this)[0]) + "px");
  })
  .on("mouseout", function(event, d){
    tooltip.style("visibility", "hidden");
    tooltip.text("");
  })
  .on("click", function(event, d) {
    let nodeDatas = getNodeDatas(d, nodes)
    let hashtags = nodeDatas.hashtags.join(", ")
    nodeTitle.html(nodeDatas.title);
    nodeAuthor.html("écrit par "+nodeDatas.author);
    nodeTextDiv.html(nodeDatas.text);
    nodeHashtagsDiv.html("# : " +hashtags);
    node.style("fill", function(d){
      var datas = getNodeDatas(d, nodes);
      var color =  getNodeColor(datas);
      return color;
    }) //reset color on all nodes

    d3.select(this).style("fill", "green");
    nodeTitle.style("display", "block") //show title, otherwise hidden

    //open side bar
    d3.select("#add-node-form").style("display", "none")
    d3.select("#messages-inside").style("display", "block")
    d3.select("#span-toggle-writing").html("⇩");
    d3.select("#span-toggle-messages").html("⇧")

    selectReact.value = nodeDatas.id;
  });
  
}

// displayNodeInfo for graph-admin
// The toggle of the menu is done by a listener on nodeTitle in graph-admin.js
export function displayNodeInfoAdmin(node, nodeId, nodeTitle, nodeAuthor, nodeText, nodeHashtags, nodeType, aside) {
  // TODO fix
  node.on("click", function(event, selectedNode) {
    // We set the values of the inputs
    nodeId.value = selectedNode.id;
    nodeTitle.value = selectedNode.title;
    nodeAuthor.value = selectedNode.author;
    nodeText.value = selectedNode.text;
    nodeHashtags.value = selectedNode.hashtags.join(" / ");
    nodeType.value = selectedNode.type;
    // We show the inputs (aside class is defined in graph-adminElements.js)
    aside.toggleModifyMessageDiv();
    // We set the colors of the graph nodes
    d3.selectAll(".node").style("fill", graphNode => getNodeColor(graphNode)); //reset color on all nodes
    d3.select(this).style("fill", "green");
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