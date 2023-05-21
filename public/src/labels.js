export function createLabels(svg, nodes) {

    var label = svg
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .style('fill', 'white')
      .style('stroke', 'none')
      .attr('text-anchor', 'middle') 
      .text(function (d) {
        return d.author
      })

    return label
  }