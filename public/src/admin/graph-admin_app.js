"use strict";

import { fetchData } from "../fetch_database.js";
import { createNodeDragBehavior } from "../simulation.js"
import {createHierarchy} from "../hierarchy.js";
import {createLinks, joinLinks} from "../links.js";
import {createNodes, displayNodeInfo, joinNodes} from "../nodes.js";
import {createLabels, joinLabels} from "../labels.js";

/** Constantes */

const nodeTextDiv = d3.select("#node-text");
const nodeHashtagsDiv = d3.select("#node-hashtags");
const nodeTitle = d3.select("#node-title");
const nodeAuthor = d3.select("#node-author");

/** Variables */

let result;
let fetchedNodes = [];
let linkSelection;
let nodeSelection;
let labelSelection;
let nodeDragBehavior;
let decreeLinks;
let nodes;
let links;
let simulation;

let strats;
let root;

/** Fonctions utils */

function removeHashtag(h) {
    if (h.charAt(0) == "#") {
        h = h.substring(1);
    }

    h = h.toLowerCase()
    return h.trim()
}

function ticked(){
    linkSelection
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
    nodeSelection
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    labelSelection
        .attr('x', function (d) {
            return d.x
        })
        .attr('y', function (d) {
            return d.y
        })
}

async function updateData() {
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

    fetchedNodes = result.nodes;
    strats = createHierarchy(fetchedNodes);
    root = d3.hierarchy(strats);
    decreeLinks = root.links();
    nodes = root.descendants();

    links = decreeLinks;
}

function generateGraph(){
    /** Mise en place de la hierarchie des données */

    let clusterLayout = d3.cluster()
        .size([parameters.width, parameters.height])

    clusterLayout(root)

    /** Mise en place de la simulation */
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(decreeLinks).id(d => d.id).distance(0).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter(parameters.width / 2, parameters.height / 2))
        .force('collide',d3.forceCollide().radius(50))
        .tick(ticked)

    /** Mise en place des liens */
    linkSelection = createLinks(svg, links);

    /** Mise en place des noeuds */
    nodeSelection = createNodes(svg, nodes, fetchedNodes);

    /** Mise en place des labels */
    labelSelection = createLabels(svg, nodeSelection, nodes, fetchedNodes);

    simulation.on('tick', ticked);

    displayNodeInfo(fetchedNodes, nodeSelection, nodeTextDiv, nodeHashtagsDiv, nodeTitle, nodeAuthor)

    nodeDragBehavior = createNodeDragBehavior(simulation);

    nodeSelection.call(nodeDragBehavior);
}

export async function updateGraph(){
    await updateData();

    linkSelection = joinLinks(svg, links);

    nodeSelection = joinNodes(svg, nodes, fetchedNodes);

    labelSelection = joinLabels(svg, nodeSelection, nodes, fetchedNodes);

    simulation.nodes(nodes)
        .force("link", d3.forceLink(decreeLinks).id(d => d.id).distance(0).strength(1))
        .tick(ticked);

    simulation.alpha(1).restart();

    simulation.on('tick', ticked);

    displayNodeInfo(fetchedNodes, nodeSelection, nodeTextDiv, nodeHashtagsDiv, nodeTitle, nodeAuthor)

    nodeDragBehavior = createNodeDragBehavior(simulation);

    nodeSelection.call(nodeDragBehavior);
}

/** Récupération initale des données */

await updateData();

/** Graph settings */

// Set the parameters for the graph (dimensions, margins, etc.)
const parameters = {
    margin : { top: 10, right: 10, bottom: 10, left: 10 },
    width : document.getElementById('graph').clientWidth,
    height : document.getElementById('graph').clientHeight
}

// Append the SVG object representing the graph to the page
let svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', parameters.width)
    .attr('height', parameters.height)

generateGraph();

/** Sockets */

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
