import {fetchData} from "./fetch_database.js";
import {createNodeDragBehavior} from "./simulation.js";
import {createNodes, displayNodeInfo, joinNodes} from "./nodes.js";
import {createLabels, joinLabels} from "./labels.js";
import {insertData} from "./insert_database.js";
import {createHierarchy} from "./hierarchy.js";
import {createLinks, joinLinks} from "./links.js";

/** Constantes */

const nodeTextDiv = d3.select("#node-text");
const nodeTitle = d3.select("#node-title");
const nodeAuthor = d3.select("#node-author");
const selectReact = document.getElementById("add-node-react");
const sessionId = document.location.href.split('/').pop().split('?').shift();

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
    result = await fetchData(sessionId);
  } catch (e) {
    console.log("Error while fetching datas:", e);
    return;
  }
  fetchedNodes = result.nodes;
  strats = createHierarchy(fetchedNodes);
  root = d3.hierarchy(strats);
  decreeLinks = root.links();
  nodes = root.descendants();

  links = decreeLinks;

  /** Récupération des options pour la séléction de la réaction */
  let preselectedOption = selectReact.selectedIndex;

  while (selectReact.options.length > 0) {
    selectReact.remove(0);
  }

  let decrees = fetchedNodes.filter(d=> d.type == "decree");
  let contributions = fetchedNodes.filter(d=> d.type == "contribution");
  let roots = fetchedNodes.filter(d=> d.type == "root");

  if(selectReact.options.length !== fetchedNodes.length) {
    for (const decree of decrees) {

      let option = new Option(decree.title, decree.id)
      selectReact.add(option) //add an option for each decree

    }

    for (const root of roots) {

      let option = new Option(root.title, root.id)
      selectReact.add(option) //add an option for each decree

    }

    for (const contribution of contributions) {

      let option = new Option(contribution.title, contribution.id);
      selectReact.add(option) //add an option for each decree

    }
    if (preselectedOption !== -1) {
      selectReact.selectedIndex = preselectedOption;
    }else{
      selectReact.selectedIndex = 0;
    }

    document.getElementById("toggle_checkbox").checked = true;
  }
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
    linkSelection = createLinks(svg, links, fetchedNodes);

  /** Mise en place des noeuds */
    nodeSelection = createNodes(svg, nodes, fetchedNodes);

  /** Mise en place des labels */
    labelSelection = createLabels(svg, nodeSelection, nodes, fetchedNodes);

  simulation.on('tick', ticked);

  displayNodeInfo(fetchedNodes, nodeSelection, nodeTextDiv, nodeTitle, nodeAuthor, selectReact, labelSelection)

  nodeDragBehavior = createNodeDragBehavior(simulation);

  nodeSelection.call(nodeDragBehavior);
}

export async function updateGraph(){
  await updateData();

  linkSelection = joinLinks(svg, links, fetchedNodes);

  nodeSelection = joinNodes(svg, nodes, fetchedNodes);

  labelSelection = joinLabels(svg, nodeSelection, nodes, fetchedNodes);

  simulation.nodes(nodes)
            .force("link", d3.forceLink(decreeLinks).id(d => d.id).distance(0).strength(1))
            .tick(ticked);

  simulation.alpha(1).restart();

  simulation.on('tick', ticked);

  displayNodeInfo(fetchedNodes, nodeSelection, nodeTextDiv, nodeTitle, nodeAuthor, selectReact, labelSelection)

  nodeDragBehavior = createNodeDragBehavior(simulation);

  nodeSelection.call(nodeDragBehavior);
}

export function getLabelSelection() {
  return labelSelection;
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

/** Gestion du formulaire d'ajout de nouveaux noeuds */
const myForm = document.getElementById("add-node-form");

myForm.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent the default form submission behavior

  const inputTitle = document.getElementById("add-node-title");
  const inputAuthor = document.getElementById("add-node-author");
  const inputText = document.getElementById("add-node-text");
  const inputReact = document.getElementById("add-node-react");
  const inputBelief = document.getElementById("add-node-belief");
  const inputType = document.getElementById("add-node-type");

  const inputTitleValue = inputTitle.value;
  const inputAuthorValue = inputAuthor.value;
  const inputTextValue = inputText.value;
  const inputDecreeValue = inputReact.value;
  const inputBeliefValue = inputBelief.value;
  const nextNodeId = nodes.length + 1;
  const inputTypeValue = inputType.value;

  const nodeData = {
    "author": inputAuthorValue,
    "id": nextNodeId,
    "text": inputTextValue,
    "react": inputDecreeValue,
    "belief": inputBeliefValue,
    "title": inputTitleValue,
    "type": inputTypeValue
  }

  //Reset form
  let form = document.getElementById("add-node-form");
  form.reset();
  //UPDATE DB
  insertData(nodeData, sessionId);
});


