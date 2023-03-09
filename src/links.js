
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
              value: numCommonHashtags
            });
          }
        }
      }
    
      return links;
    }    
    
 // Function to create links between nodes in an SVG element
 export function createLinks(svg, nodes) {
    // Call the createLinksData function to get the links array

    let links = createLinksData(nodes);
    // Bind the links array to a set of SVG lines, setting their class, stroke color, and stroke width
    let link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", "gray")
      .style("stroke-width", 1);
  
    // Return an array containing the links array and the SVG line elements
    return [links, link];
  }
  