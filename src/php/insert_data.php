<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // collect value of input field
    $text = $_POST['text'];
    $author = $_POST['author'];
    $hashtags = $_POST['hashtags'];

    if (empty($text) || empty($author) || empty($hashtags)) {
        echo "data is empty";
    } else {
        try
        {
            // On se connecte à phpMyAdmin
            $mysqlClient = new PDO('mysql:host=DB3.int.utc.fr;dbname=wbabel;charset=utf8', '', '');
        }
        catch(Exception $e)
        {
            // En cas d'erreur, on affiche un message et on arrête tout
                die('Erreur : '.$e->getMessage());
        }

        $sqlQuery = "INSERT INTO nodes (author, text, hashtags) VALUES (?,?,?)";
        $insertStatement = $mysqlClient->prepare($sqlQuery);
        $insertStatement->execute([$author,$text,$hashtags]);
    }
}
else{
echo "Rien à voir ici";
}
?>