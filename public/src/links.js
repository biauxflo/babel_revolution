import {getNodeDatas} from "./nodes.js";

  export function createLinks(svg, datas, fetchedNodes){
      let links = svg.append("g")
          .selectAll("line")
          .data(datas)
          .join("line")
          .attr("stroke", "#69ffc8")
          .attr("stroke-opacity", 1)

      return links;
  }

export function joinLinks(svg, datas, fetchedNodes){
    let links = svg
        .selectAll("line")
        .data(datas)
        .join("line")
        .attr("stroke", "#69ffc8")
        .attr("stroke-opacity", 1)

    return links;
}
  