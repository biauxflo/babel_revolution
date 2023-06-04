import {getNodeDatas} from "./nodes.js";

  export function createLinks(svg, datas, fetchedNodes){
      let links = svg.append("g")
          .selectAll("line")
          .data(datas)
          .join("line")
          .attr("stroke", function (d){
              let dataSource = getNodeDatas(d.source, fetchedNodes);
              let dataTarget = getNodeDatas(d.target, fetchedNodes);
              if (dataSource.belief === "against" && dataTarget.belief === "against") {
                  return "#69ffc8";
              }
              return "#ff00ff";
          })
          .attr("stroke-opacity", 1)
          .style("z-index", 0);

      return links;
  }

export function joinLinks(svg, datas, fetchedNodes){
    let links = svg
        .selectAll("line")
        .data(datas)
        .join("line")
        .attr("stroke", function (d){
            let dataSource = getNodeDatas(d.source, fetchedNodes);
            let dataTarget = getNodeDatas(d.target, fetchedNodes);
            if (dataSource.belief === "against" && dataTarget.belief === "against") {
                return "#69ffc8";
            }
            return "#ff00ff";
        })
        .attr("stroke-opacity", 1)
        .style("z-index", 0);

    return links;
}
  