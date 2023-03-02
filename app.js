
// =================================== DATA ===================================

// Charger les fichiers CSV des noeuds et des liens
d3.csv("nodes.csv").then(function(nodesData) {
  d3.csv("links.csv").then(function(linksData) {

    // Convertir les données des noeuds en format utilisable par d3
    const nodes = nodesData.map(function(d) {
      return {id: d.id, label: d.label};
    });

    // Convertir les données des liens en format utilisable par d3
    const links = linksData.map(function(d) {
      return {source: d.source, target: d.target};
    });

    // Code pour dessiner le graphe ici en utilisant les données de nodes et links
    console.log(nodes);
    console.log(links);

        // =================================== GRAPH SETTINGS ===================================

    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const width = window.innerWidth - margin.left - margin.right
    const height = window.innerHeight - margin.top - margin.bottom

    // Append the SVG object to the page
    let svg = d3
      .select('#graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    // =================================== NODES ===================================

    const node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 30)
        .style("fill", "blue");

    // =================================== LINKS ===================================

    const link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "gray")
        .style("stroke-width", 1);

    // =================================== LABELS ===================================

    // Ajouter les étiquettes de nœuds à notre graphique
    var label = svg
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .style('fill', 'red')
      .style('stroke', 'none')
      .attr('text-anchor', 'middle') // Ajouter cet attribut
      .text(function (d) {
        return d.label
      })

    // =================================== FORCE SIMULATION ===================================

    // Create the force simulation for the nodes
    let simulation = d3
      .forceSimulation(nodes)
      .force('link',
        d3.forceLink(links).id(d => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alphaTarget(0.1) // Add alphaTarget parameter to the simulation

    // =================================== TOOLTIP ===================================

    const nodeInfo = d3.select("#node-info");

    node.on("mouseover", function(event, d) {
      nodeInfo.html(d.text);
      d3.select(this).style("fill", "red");
    })
    .on("mouseout", function(d) {
      nodeInfo.html("");
      d3.select(this).style("fill", "blue");
    });

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

    // =================================== FORM ADDING NODE ===================================

    d3.select('#add-node-form').on('submit', function () {
      d3.event.preventDefault()
      const input = d3.select('#add-node-input')
      const label = input.property('value')
      const id = 10
      nodes.push({ id: id, label: label })
      links.push({ source: 1, target: id })
      input.property('value', '')
      updateGraph()
    })

    function updateGraph () {
      // Update the nodes of the graph
      node = node.data(nodes, d => d.id)
      node
        .enter()
        .append('circle')
        .attr('r', 15)
        .attr('fill', '#69b3a2')
        .merge(node)
        .attr('id', d => 'node-' + d.id)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .call(drag(simulation))

      // Update the links between the nodes
      link = link.data(links, d => [d.source, d.target])
      link
        .enter()
        .append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('id', d => 'link-' + d.source.id + '-' + d.target.id)
        .merge(link)

      // Update the labels of the nodes
      label = label.data(nodes, d => d.id)
      label
        .enter()
        .append('text')
        .text(d => d.label)
        .merge(label)
        .attr('x', d => d.x + 20)
        .attr('y', d => d.y)

      // Update the positions of the nodes and links on each tick of the simulation
      simulation.nodes(nodes)
      simulation.force('link').links(links)
      simulation.alpha(1).restart()
    }


    // =================================== DRAGGING ===================================

    const drag = simulation => {
      function dragstarted (event) {
        if (!event.active) simulation.alphaTarget(0.1).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged (event) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended (event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    }
    node.call(drag(simulation))

    // =================================== SIMULATION ===================================

    // Update the positions of the nodes and links on each tick of the simulation
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      node.attr('cx', d => d.x).attr('cy', d => d.y)
      label
        .attr('x', function (d) {
          return d.x
        })
        .attr('y', function (d) {
          return d.y
        })
    })


  });
});


