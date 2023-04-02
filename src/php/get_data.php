<?php
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

// Si tout va bien, on peut continuer

// On récupère tout le contenu de la table nodes
$sqlQuery = 'SELECT * FROM nodes';
$nodesStatement = $mysqlClient->prepare($sqlQuery);
$nodesStatement->execute();
$nodes = $nodesStatement->fetchAll();
echo json_encode($nodes);
?>