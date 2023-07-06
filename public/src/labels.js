import {getNodeColor, getNodeDatas} from "./nodes.js";

const nodeTextDiv = d3.select("#node-text");
const nodeTitle = d3.select("#node-title");
const nodeAuthor = d3.select("#node-author");
const writtenBy = d3.select("#written-by"); //div to show before author

function onLabelClick(event, d, fetchedNodes, nodeSelection) {
    let datas = getNodeDatas(d, fetchedNodes);
    let id = datas.id
    nodeTitle.html(datas.title);
    writtenBy.style("display", "block")
    nodeAuthor.html(datas.author);
    nodeTextDiv.html(datas.text);
    nodeSelection.style("fill", function(d){
        let datas = getNodeDatas(d, fetchedNodes);
        let color =  getNodeColor(datas, d.depth);
        return color;
    }) //reset color on all nodes
    nodeSelection.filter(d => String(id) === d.data.data.id).style("fill", "#1c027e");
    nodeTitle.style("display", "block") //show title, otherwise hidden

    //open side bar
    d3.select("#add-node-form").style("display", "none")
    d3.select("#messages-inside").style("display", "block")
    d3.select("#span-toggle-writing").html("⇩")
    d3.select("#span-toggle-messages").html("⇧")
}

// Create label when using d3-hierarchy
// svg : svg element
// node : svg selection of nodes
// nodes : hierarchy datas for the graph
// fetchedNodes : nodes as stored in DB
export function createLabels(svg, nodeSelection, nodes, fetchedNodes) {

    let label = svg
        .append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .attr('class', 'label')
        .style('fill', 'white')
        .style('stroke', 'none')
        .style('opacity', 1)
        .attr('text-anchor', 'middle')
        .attr('id', d => d.data.data.id)
        .text(function (d) {
            let datas = getNodeDatas(d, fetchedNodes);
            let label = datas.title;
            return label
        })
        // Display node infos
        .on("click", function (event,d){
            onLabelClick(event, d, fetchedNodes, nodeSelection)
        })

    return label;
}

export function joinLabels(svg, nodeSelection, nodes, fetchedNodes) {

    let label = svg
        .selectAll('text')
        .data(nodes)
        .join('text')
        .style('fill', 'white')
        .style('stroke', 'none')
        .style('opacity', 1)
        .attr('text-anchor', 'middle')
        .text(function (d) {
            let datas = getNodeDatas(d, fetchedNodes);
            let label = datas.title;
            return label
        })
        // Display node infos
        .on("click", function (event,d){
            onLabelClick(event, d, fetchedNodes, nodeSelection)
        })

    return label
}