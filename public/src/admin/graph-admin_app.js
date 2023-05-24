"use strict";

import { fetchData } from "../fetch_database.js";
import { createNodeDragBehavior, forceSimulation, simulationTicked } from "../simulation.js";
import { createNodes, displayNodeInfoAdmin } from "../nodes.js";
import { createLinks } from "../links.js";
import { createLabels } from "../labels.js";
import { insertData } from "../insert_database.js";
import { ToggleAside } from "./graph-adminElements.js";

let result;
try {
    // We get the number of the session in the url to send it
    const idSession = document.location.href.split('/').pop();
    result = await fetchData('/node/session/' + idSession);
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

// When an user clicks on a node, it shows its text, hashtags, title and author
const nodeId = document.querySelector("#node_id");
const nodeTitle = document.querySelector("#node_title_input");
const nodeAuthor = document.querySelector("#node_author_input");
const nodeText = document.querySelector("#node_text_input");
const nodeHashtags = document.querySelector("#node_hashtags_input");
const nodeType = document.querySelector("#node_type");
const aside = new ToggleAside();  // This one is used to toggle the menu and show the node content
displayNodeInfoAdmin(node, nodeId, nodeTitle, nodeAuthor, nodeText, nodeHashtags, nodeType, aside);

// =================================== DRAGGING ===================================

let nodeDragBehavior = createNodeDragBehavior(simulation);

// Apply drag behavior to the node elements
node.call(nodeDragBehavior);

// =================================== SIMULATION ===================================

simulation = simulationTicked(simulation, link, node, label)

// =================================== SOCKET ==================================

const socket = io();

socket.on('databaseUpdate', async function () {
    await updateGraph();
    console.log("+++ databaseUpdate done");
});

// The event 'decreePublished' is received when a new decree is published
socket.on('decreePublished', async function (decreeAndExamples) {
    const decreeDialog = document.querySelector('dialog#session_dialog');
    // We add the decree type, title and text
    decreeDialog.querySelector('#dialog_type').textContent = 'Nouveau décret';
    decreeDialog.querySelector('#dialog_title').textContent = decreeAndExamples.decree.title;
    decreeDialog.querySelector('#dialog_text').textContent = decreeAndExamples.decree.text;

    const dialogExamples = decreeDialog.querySelector('div#dialog_examples');
    // We delete the precedent examples
    dialogExamples.innerHTML = '';
    // Then we add the current examples
    decreeAndExamples.examples.forEach(example => {
        let paragraphText = '';
        if (example.title) {
            paragraphText += '[ ' + example.title + ' ] ';
        }
        if (example.author) {
            paragraphText += '[ ' + example.author + ' ] : ';
        }
        paragraphText += example.text;
        if (example.hashtags) {
            paragraphText += ' [ #' + example.hashtags + ' ]';
        }
        const paragraph = document.createElement('p');
        paragraph.textContent = paragraphText;
        dialogExamples.appendChild(paragraph);
    });
    // We show the dialog
    decreeDialog.showModal();
    // We update the graph
    await updateGraph();
    console.log("+++ sessionCompleted done");
});

// The event 'sessionCompleted' is received when the session ends
socket.on('sessionCompleted', async function (end) {
    const endDialog = document.querySelector('dialog#session_dialog');
    // We add the decree title and text
    endDialog.querySelector('#dialog_type').textContent = null;
    endDialog.querySelector('#dialog_title').textContent = end.title;
    endDialog.querySelector('#dialog_text').textContent = end.text;
    // We delete the examples
    endDialog.querySelector('div#dialog_examples').innerHTML = '';
    // We show the dialog
    endDialog.showModal();
    // We update the graph
    await updateGraph();
    console.log("+++ sessionCompleted done");
});

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
    displayNodeInfoAdmin(node, nodeId, nodeTitle, nodeAuthor, nodeText, nodeHashtags, nodeType, aside);
}

// ======== UPDATE DATA ===========
async function updateData() {
    try {
        // We get the number of the session in the url to send it
        const idSession = document.location.href.split('/').pop();
        var newResult = await fetchData('/node/session/' + idSession);
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

