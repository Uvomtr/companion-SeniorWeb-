<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$pdo = require __DIR__ . '/config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password']) || !isset($data['age']) ||
    !isset($data['sex']) || !isset($data['address']) || !isset($data['health_issue']) || 
    !isset($data['role'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit();
}

$username = trim($data['username']);
$password = $data['password'];
$age = (int) $data['age'];
$sex = trim($data['sex']);
$address = trim($data['address']);
$health_issue = trim($data['health_issue']);
$role = trim($data['role']);

try {
    $stmt = $pdo->prepare("SELECT 1 FROM users WHERE username = ?");
    $stmt->execute([$username]);

    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "Username already exists"]);
        exit();
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO users (username, password, age, sex, address, health_issue, role) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$username, $passwordHash, $age, $sex, $address, $health_issue, $role]);

    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} catch (PDOException $e) {
    error_log("Registration error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "An unexpected error occurred"]);
}
?>
