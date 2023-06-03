import {getNodeColor, getNodeDatas} from "./nodes.js";

const nodeTextDiv = d3.select("#node-text");
const nodeHashtagsDiv = d3.select("#node-hashtags");
const nodeTitle = d3.select("#node-title");
const nodeAuthor = d3.select("#node-author");

function onLabelClick(event, d, fetchedNodes, nodeSelection) {
    let datas = getNodeDatas(d, fetchedNodes);
    let hashtags = datas.hashtags.join(" / ")
    let id = datas.id
    nodeTitle.html(datas.title);
    nodeAuthor.html("écrit par "+datas.author);
    nodeTextDiv.html(datas.text);
    nodeHashtagsDiv.html("# : " +hashtags);
    nodeSelection.style("fill", function(d){
        var datas = getNodeDatas(d, fetchedNodes);
        var color =  getNodeColor(datas);
        return color;
    }) //reset color on all nodes
    nodeSelection.filter(d => String(id) === d.data.data.id)
        .style("fill", "green");
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
        .attr('class', 'label')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .style('fill', 'white')
        .style('stroke', 'none')
        .attr('text-anchor', 'middle')
        .text(function (d) {
            let datas = getNodeDatas(d, fetchedNodes);
            let label = datas.author;
            return label
        })
        // Display node infos
        .on("click", function (event,d){
            onLabelClick(event, d, fetchedNodes, nodeSelection)
        });

    return label;
}

export function joinLabels(svg, nodeSelection, nodes, fetchedNodes) {

    let label = svg
        .selectAll('text')
        .data(nodes)
        .join('text')
        .style('fill', 'white')
        .style('stroke', 'none')
        .attr('text-anchor', 'middle')
        .text(function (d) {
            let datas = getNodeDatas(d, fetchedNodes);
            let label = datas.author;
            return label
        })
        // Display node infos
        .on("click", function (event,d){
            onLabelClick(event, d, fetchedNodes, nodeSelection)
        });

    return label
}