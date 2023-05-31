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
