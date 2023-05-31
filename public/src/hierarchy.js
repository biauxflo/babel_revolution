export function createHierarchy(nodes){
    let datas = []
    let root;

    try{
        root = nodes.find(d => d.type === "root");
    }catch (error){
        console.log(error);
    }

    datas.push({
        id: root.id,
        parent: "",
    })

    for (let i = 0; i < nodes.length; i++) {

        if (nodes[i].type === "contribution") {
            datas.push({
                id: nodes[i].id,
                parent: nodes[i].decree,
            });
        }
        else if (nodes[i].type === "decree"){
            datas.push({
                id: nodes[i].id,
                parent: root.id,
            });
        }
    }

    console.log(datas);

    let res = d3.stratify()
        .id(function(d) { return d.id; })
        .parentId(function(d) { return d.parent; })
        (datas);

    let ret = d3.hierarchy(res);
    return ret
}