export function fetchData(sessionId) {
    let fetchUrl = "/node/";
    if (parseInt(sessionId)){
        fetchUrl += "session/" + sessionId;
    }

    return fetch(fetchUrl)
        .then((response) => {
            if (!response.ok) { // Before parsing (i.e. decoding) the JSON data,
                // check for any errors.
                // In case of an error, throw.
                throw new Error("Something went wrong!");
            }
            return response.json(); // Parse the JSON data.
        })
        .then((data) => {
            return new Promise((resolve) => {
                resolve({ nodes: data });
            });
        })
        .catch((error) => {
            console.log(error);
        });
}