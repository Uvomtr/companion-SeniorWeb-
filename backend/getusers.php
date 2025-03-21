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
    // Fetch clients only
    $sql = "SELECT id, username, role, age, sex, address, health_issue, created_at 
            FROM users WHERE role = 'client'"; // Fetch only clients
    $result = $conn->query($sql);

    if ($result === false) {
        echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
        exit;
    }

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    // Get total clients (seniors)
    $countQuery = "SELECT COUNT(*) AS totalSeniors FROM users WHERE role = 'client'";
    $countResult = $conn->query($countQuery);
    $totalSeniors = $countResult->fetch_assoc()["totalSeniors"];

    echo json_encode([
        "success" => true,
        "users" => $users, // This will now only include clients
        "totalSeniors" => $totalSeniors // Total count of clients
    ]);
}

// Handle POST (create a new client)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get data from the POST request body
    $data = json_decode(file_get_contents("php://input"), true);

    $username = $data['username'];
    $password = $data['password'];
    $age = $data['age'];
    $sex = $data['sex'];
    $address = $data['address'];
    $health_issue = $data['health_issue'];

    // Validate input
    if (empty($username) || empty($password) || empty($age) || empty($sex) || empty($address) || empty($health_issue)) {
        echo json_encode(["success" => false, "message" => "All fields are required"]);
        exit;
    }

    // Hash password before storing it
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert client into the database
    $sql = "INSERT INTO users (username, password, age, sex, address, health_issue, role) 
            VALUES (?, ?, ?, ?, ?, ?, 'client')";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssisss", $username, $hashedPassword, $age, $sex, $address, $health_issue);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Senior added successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to add senior"]);
    }

    $stmt->close();
}

// Handle DELETE (delete a client)
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    // Get user ID from the URL
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['id'];

    if (empty($userId)) {
        echo json_encode(["success" => false, "message" => "User ID is required"]);
        exit;
    }

    // Delete the client
    $deleteQuery = "DELETE FROM users WHERE id = ? AND role = 'client'"; // Ensure we're deleting a client
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
    // Get updated data from the request body
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['id'];
    $username = $data['username'];
    $age = $data['age'];
    $sex = $data['sex'];
    $address = $data['address'];
    $health_issue = $data['health_issue'];

    if (empty($userId)) {
        echo json_encode(["success" => false, "message" => "User ID is required"]);
        exit;
    }

    // Update the client data
    $updateQuery = "UPDATE users SET username = ?, age = ?, sex = ?, address = ?, health_issue = ? WHERE id = ? AND role = 'client'";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param("sisssi", $username, $age, $sex, $address, $health_issue, $userId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update user"]);
    }

    $stmt->close();
}

$conn->close();
?>
