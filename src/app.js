
// =================================== IMPORT MODULES ===================================

import { ref, update, set} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { fetchData } from "./fetch_database.js";
import { forceSimulation, simulationTicked, createNodeDragBehavior } from "./simulation.js";
import { createNodes, displayNodeText } from "./nodes.js";
import { createLinks } from "./links.js";
import { createLabels } from "./labels.js";

fetchData()
  .then((result) => {

    let nodes = result.nodes;
    const database = result.database;
    
    console.log("Les deux opérations asynchrones sont terminées avec succès.");

// =================================== GRAPH SETTINGS ===================================

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

// =================================== NODES ===================================
    
    let node = createNodes(svg, nodes)

// =================================== LINKS ===================================

    let [links, link] = createLinks(svg, nodes)

// =================================== LABELS ===================================

    let label = createLabels(svg, nodes)

// =================================== FORCE SIMULATION ===================================

    let simulation = forceSimulation(nodes, links, parameters)

// =================================== TOOLTIP ===================================

    const nodeDiv = d3.select("#node-info");

    displayNodeText(node, nodeDiv)

// =================================== DRAGGING ===================================

    let nodeDragBehavior = createNodeDragBehavior(simulation);

    // Apply drag behavior to the node elements
    node.call(nodeDragBehavior);

// =================================== SIMULATION ===================================

    simulation = simulationTicked(simulation, link, node, label)

// =================================== FORM ADDING NODE ===================================


    function addNewNode(nodeData) {
      
      // Add the new node to the nodes array
      nodes.push(nodeData);

      // Recompute the links with the updated nodes array
      [links, link] = createLinks(svg, nodes);

      // Updating the database
      const updates = {};
      updates['/nodes/' + (nodeData.id - 1)] = nodeData;
      // update(ref(database), updates);
      
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
        .style("fill", "blue")
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
      displayNodeText(node, nodeDiv)

    }

    const myForm = document.getElementById("add-node-form");

    myForm.addEventListener("submit", function(event) {
      event.preventDefault(); // prevent the default form submission behavior
      const inputAuthor = document.getElementById("add-node-author");
      const inputText = document.getElementById("add-node-text");
      const inputHashtag = document.getElementById("add-node-hashtags");

      const inputAuthorValue = inputAuthor.value;
      const inputTextValue = inputText.value;
      const inputHashTagArray = inputHashtag.value.split(',').map(hashtag => hashtag.trim());
      const nextNodeId = nodes.length + 1;

      const nodeData = {
        "author": inputAuthorValue,
        "hashtags": inputHashTagArray,
        "id": nextNodeId,
        "text": inputTextValue,
      }

      addNewNode(nodeData)
    });

// =================================== RESET GRAPH BUTTON  ===================================

    let monBouton = document.getElementById("reset-graph");
    monBouton.addEventListener("click",   function() {

      const reset_node = [{
        "author": "Ismail",
        "hashtags": ["intro"],
        "id": 1,
        "text": "Hello World",
      }];

      set(ref(database, '/nodes/'), reset_node);

      // Add the new node to the nodes array
      nodes = reset_node;

      // Recompute the links with the updated nodes array
      [links, link] = createLinks(svg, nodes);

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
        .style("fill", "blue")
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
      simulation.force('link').links(links);
      simulation.alpha(1).restart();
    });

  })
  .catch((error) => {
    console.error("Une erreur s'est produite lors de la récupération des données:", error);
  });



