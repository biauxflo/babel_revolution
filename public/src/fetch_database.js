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
            // Parsing of the hashtags from string to tab.
            for (let i = 0; i < data.length; i++) {
                // If 'hashtags' is not null, we split it
                if (data[i].hashtags) {
                    data[i].hashtags = data[i].hashtags.split(';');
                } else {
                    // If there is no hashtag, we just assciate an empty list
                    data[i].hashtags = [];
                }
            }
            return new Promise((resolve) => {
                resolve({ nodes: data });
            });
        })
        .catch((error) => {
            console.log(error);
        });
}