import {getNodeColor} from "./nodes.js";

export function createLabels(svg, nodes) {

    const nodeTextDiv = d3.select("#node-text");
    const nodeHashtagsDiv = d3.select("#node-hashtags");
    const nodeTitle = d3.select("#node-title")
    const nodeAuthor = d3.select("#node-author")

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
        // Display node infos
      .on("click", function(event, d) {
        let hashtags = d.hashtags.join(" / ")
        let id = d.id
        nodeTitle.html(d.title);
        nodeAuthor.html("écrit par "+d.author);
        nodeTextDiv.html(d.text);
        nodeHashtagsDiv.html("# : " +hashtags);
        d3.selectAll(".node").style("fill", d => getNodeColor(d)) //reset color on all nodes
        d3.selectAll(".node").filter(d => d.id === id).style("fill", "green");
        nodeTitle.style("display", "block") //show title, otherwise hidden

        //open side bar
        d3.select("#add-node-form").style("display", "none")
        d3.select("#messages-inside").style("display", "block")
        d3.select("#button-toggle-writing").classed("button-toggle-up", false)
        d3.select("#button-toggle-writing").classed("button-toggle-down", true)
        d3.select("#button-toggle-messages").classed("button-toggle-down", false)
        d3.select("#button-toggle-messages").classed("button-toggle-up", true)
    })

    return label
  }