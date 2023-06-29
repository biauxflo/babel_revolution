function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Function to fetch datas of a node when using d3-hierarchy
// Node : d3-hierarchy element
// Nodes : Nodes stored in DB
export function getNodeDatas(node, nodes){
  let nodeId = node.data.data.id;
  let nodeDatas = nodes.find(z => String(z.id) === nodeId)
  return nodeDatas
}

export function getNodeColor(node, prof) {
  prof = prof - 2;
  if (node.type === "contribution") {
    switch (String(node.belief)) {
      case "in_favor":
        return '#960000';
      case "against":
        let color;
        let choice;
        if (prof === 0) {
          color = ['#005a00', '#025d3c', '#00832c', '#007000'];
        }else if (prof === 1) {
          color = ['#00b42c', '#00cd3c', '#00ff3c'];
        }else if (prof === 2) {
            color = ['#97ff30','#b5ff30', '#97ff6a'];
        }else{
          return '#ddff6a'
        }

        choice = getRandomInt(color.length);
        return color[choice]
      default:
        return '#000000';
    }
  }
  return '#ff4600';
}

export function getNodeStroke(node) {
    if (node.type === "contribution") {
      return '#69ffc8';
    }
    return '#ff00ff';
  }

export function createNodes(svg, datas, fetchedNodes){
  let nodes = svg.append("g")
      .selectAll("circle")
      .data(datas)
      .join("circle")
      .style("fill", function(d){
        let datas = getNodeDatas(d, fetchedNodes);
        let color =  getNodeColor(datas, d.depth);
        return color;
      })
      .attr("stroke", function(d){
        let datas = getNodeDatas(d, fetchedNodes);
        let color = getNodeStroke(datas, d.depth);
        return color;
      })
      .attr("stroke-width", function (d){
        let datas = getNodeDatas(d, fetchedNodes);
        if (datas.type === "decree") {
          return 4;
        }else{
          return 1;
        }
      })
      .attr("r", function (d) {
        let datas = getNodeDatas(d, fetchedNodes);
        if (datas.type === "root") {
          return 40;
        } else if (datas.type === "decree") {
          return 30;
        }
        return 20;
      })
  return nodes;
}

export function joinNodes(svg, datas, fetchedNodes){
  let nodes = svg
      .selectAll("circle")
      .data(datas)
      .join("circle")
      .style("fill", function(d){
        let datas = getNodeDatas(d, fetchedNodes);
        let color =  getNodeColor(datas, d.depth);
        return color;
      })
      .attr("stroke", function(d){
        let datas = getNodeDatas(d, fetchedNodes);
        let color = getNodeStroke(datas, d.depth);
        return color;
      })
      .attr("stroke-width", function (d){
        let datas = getNodeDatas(d, fetchedNodes);
        if (datas.type === "decree") {
          return 4;
        }else{
          return 1;
        }
      })
      .attr("r", function (d){
        let datas = getNodeDatas(d, fetchedNodes);
        if (datas.type === "root") {
          return 40;
        }else if (datas.type === "decree"){
          return 30;
        }
        return 20;
      })
  return nodes;
}

// Displaying node text on a div
//elements-nodes
// Displaying the text of a node on a div
export function displayNodeInfo(nodes, node, nodeTextDiv, nodeTitle, nodeAuthor, selectReact, labelSelection) {
  //if click on graph but outside a node
  const svg = d3.select("svg");

  //TODO : fix this
  svg.on("click", function(event, d) {
      node.style("fill", d => {
        let datas = getNodeDatas(d, nodes);
        return getNodeColor(datas, d.depth);
      });
      nodeTextDiv.html("");  //set text to empty to not show
      nodeTitle.html("");
      d3.select("#written-by").style("display", "none")
      nodeAuthor.html("");

      //close side bar
      d3.select("#messages-inside").style("display", "none")
      d3.select("#span-toggle-messages").html("⇩");
    }
   );

  node
  .on("mouseover", function(event, d){
    document.getElementById("toggle_checkbox").checked = true;
    labelSelection.filter(f => String(f.data.data.id) === d.data.data.id).style('opacity', 1)
    labelSelection.on("mouseover", function(event, d2){
      labelSelection.filter(f => String(f.data.data.id) === d.data.data.id && d.data.data.id === d2.data.data.id).style('opacity', 1)
    })
  })
  .on("click", function(event, d) {
    let nodeDatas = getNodeDatas(d, nodes)
    nodeTitle.html(nodeDatas.title);
    d3.select("#written-by").style("display", "block")
    nodeAuthor.html(nodeDatas.author);
    nodeTextDiv.html(nodeDatas.text);
    node.style("fill", function(d){
      let datas = getNodeDatas(d, nodes);
      let color =  getNodeColor(datas, d.depth);
      return color;
    }) //reset color on all nodes

    d3.select(this).style("fill", "#1c027e");
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
export function displayNodeInfoAdmin(node, nodeId, nodeTitle, nodeAuthor, nodeText, nodeType, aside) {
  // TODO fix
  node.on("click", function(event, selectedNode) {
    // We set the values of the inputs
    nodeId.value = selectedNode.id;
    nodeTitle.value = selectedNode.title;
    nodeAuthor.value = selectedNode.author;
    nodeText.value = selectedNode.text;
    nodeType.value = selectedNode.type;
    // We show the inputs (aside class is defined in graph-adminElements.js)
    aside.toggleModifyMessageDiv();
    // We set the colors of the graph nodes
    d3.selectAll(".node").style("fill", graphNode => getNodeColor(graphNode)); //reset color on all nodes
    d3.select(this).style("fill", "green");
  });
}