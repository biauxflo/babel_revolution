import * as AJAX from "https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js";

export function insertData(node){
    $.ajax({
        url: "https://babel.utc.fr/dev/src/php/insert_data.php",
        type: "POST",
        data: {
            author: node.author,
            text: node.text,
            hashtags: node.hashtags.join(';'),
        },
        cache: false,
        success: function(){}
        }
    );
}