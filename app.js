
// =================================== FIREBASE ===================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
import { getDatabase, ref, onValue, push, update} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyA1J5oEELCYV4N0Sd_skLk68JLGMwQerdQ",
authDomain: "babelrevolution.firebaseapp.com",
projectId: "babelrevolution",
storageBucket: "babelrevolution.appspot.com",
messagingSenderId: "360685414071",
appId: "1:360685414071:web:e3c8d49460074f9fdc4f32",
measurementId: "G-H390V8NZ3B",
databaseURL: "https://babelrevolution-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);


function fetchData() {
  return new Promise((resolve, reject) => {
    const nodes_data = ref(database, 'nodes');
    onValue(nodes_data, (snapshot) => {
      const nodes = snapshot.val();
    const links_data = ref(database, 'links');
    onValue(links_data, (snapshot) => {
      const links = snapshot.val();
      resolve({ nodes: nodes, links: links })});
    }, (error) => {
      reject(error); // rejeter la promesse en cas d'erreur
    });
  });
}

fetchData()
  .then((result) => {
    let nodes = result.nodes;
    // let links = result.links;
    
    console.log("Les deux opérations asynchrones sont terminées avec succès.");

    // =================================== GRAPH SETTINGS ===================================

    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const width = window.innerWidth - margin.left - margin.right
    const height = window.innerHeight - margin.top - margin.bottom

    // Append the SVG object to the page
    let svg = d3
    .select('#graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

    // =================================== NODES ===================================

    // Ajouter les nœuds à notre graphique
    function createNodes() {

      var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 30)
        .style("fill", "blue");
      
      return node
    }
    
    var node = createNodes()

    // =================================== LINKS ===================================

    function createLinks(nodes) {
                
      var links = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let node1 = nodes[i];
          let node2 = nodes[j];

          let commonHashtags = node1.hashtags.filter(h => node2.hashtags.includes(h));

          if (commonHashtags.length > 0) {
            links.push({ source: node1.id, target: node2.id });
          }
        }
      }

      return links
    }

    function updateLinks(nodes) {

      let links = createLinks(nodes)
      let link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "gray")
        .style("stroke-width", 1);

      return [links, link]
    }

    let [links, link] = updateLinks(nodes)

    // =================================== LABELS ===================================

    // Ajouter les étiquettes de nœuds à notre graphique
    var label = svg
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .style('fill', 'red')
      .style('stroke', 'none')
      .attr('text-anchor', 'middle') // Ajouter cet attribut
      .text(function (d) {
        return d.author
      })

    // =================================== FORCE SIMULATION ===================================

    // Create the force simulation for the nodes
    let simulation = d3
      .forceSimulation(nodes)
      .force('link',
        d3.forceLink(links).id(d => d.id).distance(300)
      )
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alphaTarget(0.1) // Add alphaTarget parameter to the simulation

    // =================================== TOOLTIP ===================================

    const nodeInfo = d3.select("#node-info");

    node.on("mouseover", function(event, d) {
      nodeInfo.html(d.text);
      d3.select(this).style("fill", "red");
    })
    .on("mouseout", function(d) {
      nodeInfo.html("");
      d3.select(this).style("fill", "blue");
    });

    function tooltip() {
    // // Créer un élément SVG pour la fenêtre contextuelle
    // const tooltip = d3.select("body").append("svg")
    //   .style('position', 'absolute')
    //   .style('z-index', '10')
    //   .style('visibility', 'hidden')
    //   .style('border', '1px solid black')
    //   .style('padding', '30px')
    //   .style('margin', '30px')

    // // Ajouter un élément texte à la fenêtre contextuelle
    // tooltip.append("text")
    //     .attr("id", "tooltip-text")
    //     .style("position", "relative")
    //     .style("font-size", "20px")
    //     .style("color", "black")
    //     .style('text-align', 'center')

    // // Ajouter une fonctionnalité de survol pour afficher la fenêtre contextuelle
    // node.on("mouseover", function(event, d) {
    //         // Définir le contenu de l'élément texte de la fenêtre contextuelle
    //         tooltip.select("#tooltip-text").text(d.label);
    //         d3.select(this).style("fill", "red");

    //         // Définir la position de la fenêtre contextuelle
    //         tooltip.style("left", (d.x + 100) + "px")
    //             .style("top", (d.y - 50) + "px")
    //             .style("visibility", "visible");
    //     })
    //     .on("mouseout", function(d) {
    //         // Masquer la fenêtre contextuelle
    //         tooltip.style("visibility", "hidden");
    //         d3.select(this).style("fill", "blue");
    //     });
    }


    // =================================== DRAGGING ===================================

    const drag = simulation => {
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
    node.call(drag(simulation))

    // =================================== SIMULATION ===================================

    // Update the positions of the nodes and links on each tick of the simulation
    simulation.on('tick', () => {
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
    })



    // =================================== FORM ADDING NODE ===================================

    const myForm = document.getElementById("add-node-form");

    function addNewNode(author, text) {

      const nextNodeId = nodes.length + 1;
      
      const node_data = {
          "author": author,
          "hashtags": ["intro"],
          "id": nextNodeId,
          "text": text,
          "x": Math.random() * width, 
          "y": Math.random()* height
      };
      
      // Add the new node to the nodes array
      nodes.push(node_data);

      // Recompute the links with the updated nodes array
      [links, link] = updateLinks(nodes);
      
      // Update the nodes, links and label selections with the updated data
      node = svg.selectAll(".node").data(nodes);
      link = svg.selectAll(".link").data(links);
      label = svg.selectAll('text').data(nodes);

      
      // Remove any old nodes, links and labels that are no longer in the updated data
      node.exit().remove();
      link.exit().remove();
      label.exit().remove();
      
      // Add any new nodes, links and labels that were added to the updated data
      node
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 30)
        .style("fill", "blue")
      
      link
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "gray")
        .style("stroke-width", 1);
      
      label
        .enter()
        .append('text')
        .style('fill', 'red')
        .style('stroke', 'none')
        .attr('text-anchor', 'middle')
        .text(function (d) {
            return d.author
          })
      

      simulation.nodes(nodes)
      simulation.force('link').links(links);
      simulation.alpha(1).restart();

  }
  

    myForm.addEventListener("submit", function(event) {
      event.preventDefault(); // prevent the default form submission behavior
      const inputAuthor = document.getElementById("add-node-author");
      const inputText = document.getElementById("add-node-text");

      const inputAuthorValue = inputAuthor.value;
      const inputTextValue = inputText.value;

      addNewNode(inputAuthorValue, inputTextValue)
    });


  })
  .catch((error) => {
    console.error("Une erreur s'est produite lors de la récupération des données:", error);
  });



