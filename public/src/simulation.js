// Create the force simulation for the nodes
export function forceSimulation(nodes, links, parameters) {

    let simulation = d3
        .forceSimulation(nodes)
        .force('link',
        d3.forceLink(links).id(d => d.id).distance(300).strength(0.01)
        )
        .force('charge', d3.forceManyBody().strength(50))
        .force('center', d3.forceCenter(parameters.width / 2, parameters.height / 2))
        .force("collide", d3.forceCollide().strength(1).radius(35))
        // .force("forceX", d3.forceX())
        // .force("forceY", d3.forceY())
        .alphaTarget(0.5) // Add alphaTarget parameter to the simulation

        return simulation
    }

// Update the positions of nodes and links in a force-directed graph simulation on each tick of the simulation.
export function simulationTicked(simulation, link, node, label) {

    function ticked() {
      link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)
      node
          .attr('cx', d => d.x).attr('cy', d => d.y)
      label
          .attr('x', function (d) {
          return d.x
          })
          .attr('y', function (d) {
          return d.y
          })
    }

    simulation.on('tick', ticked)

    return simulation

    }

// Create node dragging behavior
export function createNodeDragBehavior(simulation) {
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
