import {getNodeDatas} from "./nodes.js";

export function createLinksData(nodes) {

      let links = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
    
          const commonHashtags = node1.hashtags.filter(h => node2.hashtags.includes(h));
    
          if (commonHashtags.length > 0) {
            const numCommonHashtags = commonHashtags.length;
            links.push({
              source: node1.id,
              target: node2.id,
              value: Math.round((1/numCommonHashtags) * 10) / 10
            });
          }
        }

        if (nodes[i].type === "contribution"){
            var value;
            switch (String(nodes[i].belief)) {
                case "in_favor":
                    value = 0.9;
                    break;
                case "against":
                    value = 0.1;
                    break;
                default:
                    value = 0.4;
            }
            links.push({
                source: nodes[i].id,
                target: nodes[i].decree,
                value: value
            });
        }
        if (nodes[i].type === "root"){
            var decree = nodes.filter(d=>d.type === "decree")
            for (let k = 0; k < decree.length; k++){
                links.push({
                    source: nodes[i].id,
                    target: decree[k].id,
                    value: 1
                });
            }
        }
      }

      console.log(links);
      return links;
    }    

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
          .attr("stroke-opacity", 1);

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
        .attr("stroke-opacity", 1);

    return links;
}
  