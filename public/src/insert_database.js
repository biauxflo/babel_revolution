export function insertData(node){
    console.log(JSON.stringify(node));
    fetch('/node',{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(node),
    })
        .then(r=>console.log(r))
        .catch(err => alert(err));
}