<?php
// Database connection settings
$host = "localhost";
$user = "root"; // Change if necessary
$pass = ""; // Change if necessary
$dbname = "accnt"; // Change to your database name

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

// ✅ Return PDO instance
return $pdo;
?>
