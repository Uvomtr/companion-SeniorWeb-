<?php
// Enable CORS for development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database connection
$servername = "localhost";
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "accnt"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Handle POST requests for updating appointment status and remarks
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['appointment_id']) || !isset($data['status']) || !isset($data['remarks'])) {
        echo json_encode(["success" => false, "message" => "Missing parameters."]);
        exit;
    }

    $appointment_id = intval($data['appointment_id']);
    $status = trim($data['status']);
    $remarks = trim($data['remarks']);

    // Convert API-friendly status to match database ENUM values
    $status = ($status === "approved") ? "approved" : (($status === "rejected") ? "rejected" : $status);

    $allowedStatuses = ["approved", "rejected"];

    if (!in_array($status, $allowedStatuses)) {
        echo json_encode(["success" => false, "message" => "Invalid status value."]);
        exit;
    }

    // Update the appointment status and remarks
    $updateQuery = "UPDATE appointments SET status = ?, remarks = ? WHERE id = ?";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param("ssi", $status, $remarks, $appointment_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Appointment status updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update appointment."]);
    }
    
    $stmt->close();
}

$conn->close();
?>
