<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (
    isset($data['username']) &&
    isset($data['password']) &&
    isset($data['age']) &&
    isset($data['sex']) &&
    isset($data['address']) &&
    isset($data['health_issue'])
) {
    $username = $data['username'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $age = $data['age'];
    $sex = $data['sex'];
    $address = $data['address'];
    $health_issue = $data['health_issue'];

    $conn = openConnection();

    $stmt = $conn->prepare("INSERT INTO seniors (username, password, age, sex, address, health_issue) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssisss", $username, $password, $age, $sex, $address, $health_issue);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Senior registered successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error registering senior"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
}
?>
