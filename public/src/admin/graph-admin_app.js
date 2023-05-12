"use strict";

import { fetchData } from "../fetch_database.js";
import { createNodeDragBehavior, forceSimulation, simulationTicked } from "../simulation.js";
import { createNodes, displayNodeInfo } from "../nodes.js";
import { createLinks } from "../links.js";
import { createLabels } from "../labels.js";
import { insertData } from "../insert_database.js";
let result;
try {
    result = await fetchData();
    console.log("Les données ont été récuperées avec succès.");
}
catch (e) {
    console.log("Error :", e);
}
console.log(result);

let nodes = result.nodes;

// =================================== DECREE OPTIONS FOR MESSAGE FORM ===================================
/*
let decrees = nodes.filter(e => e.type == "decree")
let select = document.getElementById("add-node-decree");
if(select.options.length != decrees.length) {
  for (const decree of decrees) {
    select.add(new Option(decree.title, decree.id)) //add an option for each decree
  }
}
*/
// =================================== GRAPH SETTINGS ===================================

// Set the parameters for the graph (dimensions, margins, etc.)
const parameters = {
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    width: document.getElementById('graph').clientWidth,
    height: document.getElementById('graph').clientHeight
}

// Append the SVG object representing the graph to the page
let svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', parameters.width)
    .attr('height', parameters.height)

// =================================== NODES ===================================

let node = createNodes(svg, nodes)

// =================================== LINKS ===================================

let [links, link] = createLinks(svg, nodes)

// =================================== LABELS ===================================

let label = createLabels(svg, nodes)

// =================================== FORCE SIMULATION ===================================

let simulation = forceSimulation(nodes, links, parameters)

// =================================== TOOLTIP ===================================
/*
//elements-nodes
const nodeTextDiv = d3.select("#node-text");
const nodeHashtagsDiv = d3.select("#node-hashtags");
const nodeTitle = d3.select("#node-title")
const nodeAuthor = d3.select("#node-author")

displayNodeInfo(node, nodeTextDiv, nodeHashtagsDiv, nodeTitle, nodeAuthor)
*/

// =================================== DRAGGING ===================================

let nodeDragBehavior = createNodeDragBehavior(simulation);

// Apply drag behavior to the node elements
node.call(nodeDragBehavior);

// =================================== SIMULATION ===================================

simulation = simulationTicked(simulation, link, node, label)

// =================================== UPDATE GRAPH ==================================
export default async function updateGraph() {

    await updateData();

    // Update the nodes, links and label selections with the updated data
    node = svg.selectAll(".node").data(nodes);
    link = svg.selectAll(".link").data(links);
    label = svg.selectAll('text').data(nodes);


    // Remove any old nodes, links and labels that are no longer in the updated data
    node.exit().remove();
    link.exit().remove();
    label.exit().remove();

    // Add any new nodes, links and labels that were added to the updated data
    let nodeEnter = node
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 30)
        .style("fill", "black")
        .merge(node)

    let linkEnter = link
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .merge(link)

    let labelEnter = label
        .enter()
        .append('text')
        .style('fill', 'red')
        .style('stroke', 'none')
        .attr('text-anchor', 'middle')
        .text(function (d) {
            return d.author
        })
        .merge(label)

    node = nodeEnter.merge(node)
    link = linkEnter.merge(link)
    label = labelEnter.merge(label)

    simulation.nodes(nodes)
    simulation.force('link',
        d3.forceLink(links).id(d => d.id).distance(300)
    )
    simulation.alpha(1).restart();

    simulation = simulationTicked(simulation, link, node, label)
    node.call(nodeDragBehavior);
    //elements-nodes
    displayNodeInfo(node, nodeTextDiv, nodeHashtagsDiv, nodeTitle, nodeAuthor)
}

// ======== UPDATE DATA ===========
async function updateData() {
    try {
        var newResult = await fetchData();
        console.log("Les données ont été récuperées avec succès.");
    } catch (e) {
        console.log("Error while fetching datas:", e);
        return;
    }
    console.log(result);
    nodes = newResult.nodes;

    // Recompute the links with the updated nodes array
    [links, link] = createLinks(svg, nodes);
}

/*
//function for creating new nodes on main page (must be unique)
const myForm = document.getElementById("add-node-form");

myForm.addEventListener("submit", function (event) {
    event.preventDefault(); // prevent the default form submission behavior

    const inputTitle = document.getElementById("add-node-title");
    const inputAuthor = document.getElementById("add-node-author");
    const inputText = document.getElementById("add-node-text");
    const inputHashtag = document.getElementById("add-node-hashtags");
    const inputDecree = document.getElementById("add-node-decree");
    const inputBelief = document.getElementById("add-node-belief");
    const inputType = document.getElementById("add-node-type");

    const inputTitleValue = inputTitle.value;
    const inputAuthorValue = inputAuthor.value;
    const inputTextValue = inputText.value;
    const inputDecreeValue = inputDecree.value;
    const inputBeliefValue = inputBelief.value;
    const inputHashTagArray = inputHashtag.value.split(',').map(hashtag => hashtag.trim());
    const nextNodeId = nodes.length + 1;
    const inputTypeValue = inputType.value;

    const nodeData = {
        "author": inputAuthorValue,
        "hashtags": inputHashTagArray,
        "id": nextNodeId,
        "text": inputTextValue,
        "decree": inputDecreeValue,
        "belief": inputBeliefValue,
        "type": inputTypeValue,
        "title": inputTitleValue
    }

    //Reset form
    var form = document.getElementById("add-node-form");
    form.reset();
    //UPDATE DB
    insertData(nodeData);
});
*/

