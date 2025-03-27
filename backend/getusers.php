<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = "localhost";
$username = "root"; // Change if needed
$password = ""; // Change if needed
$database = "accnt";

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Fetch only users with 'client' role
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $sql = "SELECT id, username, role, age, sex, address, health_issue, barangay_id, created_at 
            FROM users WHERE role = 'client'";
    $result = $conn->query($sql);

    if ($result === false) {
        echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
        exit;
    }

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    $countQuery = "SELECT COUNT(*) AS totalSeniors FROM users WHERE role = 'client'";
    $countResult = $conn->query($countQuery);
    $totalSeniors = $countResult->fetch_assoc()["totalSeniors"];

    echo json_encode([
        "success" => true,
        "users" => $users,
        "totalSeniors" => $totalSeniors
    ]);
}

// Handle POST (create a new client)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $username = $data['username'];
    $password = $data['password'];
    $age = (int) $data['age'];
    $sex = $data['sex'];
    $address = $data['address'];
    $health_issue = $data['health_issue'];
    $barangay_id = (int) $data['barangay_id'];

    // Validate inputs
    if (empty($username) || empty($password) || empty($age) || empty($sex) || empty($address) || empty($health_issue) || empty($barangay_id)) {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
        exit;
    }

    if ($age < 60) {
        echo json_encode(["success" => false, "message" => "Age must be 60 or older"]);
        exit;
    }

    if ($barangay_id < 1 || $barangay_id > 99999) {
        echo json_encode(["success" => false, "message" => "Barangay ID must be between 1 and 99999"]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (username, password, age, sex, address, health_issue, barangay_id, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'client')";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssisssi", $username, $hashedPassword, $age, $sex, $address, $health_issue, $barangay_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Senior added successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to add senior"]);
    }

    $stmt->close();
}

// Handle DELETE (delete a client)
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['id'];

    if (empty($userId)) {
        echo json_encode(["success" => false, "message" => "User ID is required"]);
        exit;
    }

    $deleteQuery = "DELETE FROM users WHERE id = ? AND role = 'client'";
    $stmt = $conn->prepare($deleteQuery);
    $stmt->bind_param("i", $userId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete user"]);
    }

    $stmt->close();
}

// Handle PUT (update a client)
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['id'];
    $username = $data['username'];
    $age = (int) $data['age'];
    $sex = $data['sex'];
    $address = $data['address'];
    $health_issue = $data['health_issue'];
    $barangay_id = (int) $data['barangay_id'];

    if (empty($userId)) {
        echo json_encode(["success" => false, "message" => "User ID is required"]);
        exit;
    }

    if ($age < 60) {
        echo json_encode(["success" => false, "message" => "Age must be 60 or older"]);
        exit;
    }

    if ($barangay_id < 1 || $barangay_id > 99999) {
        echo json_encode(["success" => false, "message" => "Barangay ID must be between 1 and 99999"]);
        exit;
    }

    $updateQuery = "UPDATE users SET username = ?, age = ?, sex = ?, address = ?, health_issue = ?, barangay_id = ? WHERE id = ? AND role = 'client'";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param("sisssii", $username, $age, $sex, $address, $health_issue, $barangay_id, $userId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update user"]);
    }

    $stmt->close();
}

$conn->close();
?>
