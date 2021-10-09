<?php

$servername = "localhost";
$username = "root";
$password = "";

// Create connection
try {
    $pdo = new PDO("mysql:host=$servername;dbname=digital-games", $username, $password);
    // set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }

?>