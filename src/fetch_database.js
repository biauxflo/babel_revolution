export function fetchData() {
    return fetch("https://babel.utc.fr/dev/src/php/get_data.php")
        .then((response) => {
            if(!response.ok){ // Before parsing (i.e. decoding) the JSON data,
                // check for any errors.
                // In case of an error, throw.
                throw new Error("Something went wrong!");
            }
            return response.json(); // Parse the JSON data.
        })
        .then((data) => {
            // Parsing of the hashtags from string to tab.
            for (let i = 0; i < data.length; i++) {
                data[i].hashtags = data[i].hashtags.split(';');
            }
            return new Promise((resolve) => {
                resolve({ nodes: data});
            });
        })
        .catch((error) => {
            // TODO handle errors.
        });
}