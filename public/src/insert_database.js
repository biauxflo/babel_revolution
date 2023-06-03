export function insertData(node, sessionId){
    console.log(JSON.stringify(node));
    let fetchUrl = "/node/";
    if (parseInt(sessionId)){
        fetchUrl += "session/" + sessionId;
    }
    fetch(fetchUrl,{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(node),
    })
        .then(r=>console.log(r))
        .catch(err => console.log(err));
}