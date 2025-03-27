<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'config/db.php';

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$uploadDir = "uploads/";

try {
    // ✅ Fetch user profile (JOIN users table to get username and barangay_id)
    $stmt = $pdo->prepare("SELECT u.username, u.barangay_id, up.first_name, up.middle_name, up.last_name, 
                                  up.birthday, up.address, up.id_file, up.profile_picture 
                           FROM users u 
                           LEFT JOIN user_profiles up ON u.id = up.user_id 
                           WHERE u.id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode($user ?: ["error" => "User profile not found"]);
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // ✅ Retrieve form data
        $firstName = $_POST['firstName'] ?? null;
        $middleName = $_POST['middleName'] ?? null;
        $lastName = $_POST['lastName'] ?? null;
        $birthday = $_POST['birthday'] ?? null;
        $address = $_POST['address'] ?? null;

        // ✅ File validation settings
        $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        $maxFileSize = 5 * 1024 * 1024; // 5MB

        // ✅ Preserve existing file paths
        $idFilePath = $user['id_file'] ?? null;
        $profilePicPath = $user['profile_picture'] ?? null;

        // ✅ Handle file uploads
        if (!empty($_FILES['idFile']['name'])) {
            if ($_FILES['idFile']['size'] > $maxFileSize || !in_array($_FILES['idFile']['type'], $allowedTypes)) {
                echo json_encode(["error" => "Invalid ID file type or size"]);
                exit();
            }
            $idFileName = time() . "_" . basename($_FILES['idFile']['name']);
            $idFilePath = $uploadDir . $idFileName;
            move_uploaded_file($_FILES['idFile']['tmp_name'], $idFilePath);
        }

        if (!empty($_FILES['profilePicture']['name'])) {
            if ($_FILES['profilePicture']['size'] > $maxFileSize || !in_array($_FILES['profilePicture']['type'], $allowedTypes)) {
                echo json_encode(["error" => "Invalid profile picture type or size"]);
                exit();
            }
            $profilePicName = time() . "_" . basename($_FILES['profilePicture']['name']);
            $profilePicPath = $uploadDir . $profilePicName;
            move_uploaded_file($_FILES['profilePicture']['tmp_name'], $profilePicPath);
        }

        // ✅ Insert user profile if not exists
        if (!$user['first_name']) {  // Check if profile data exists
            $stmt = $pdo->prepare("INSERT INTO user_profiles (user_id, first_name, middle_name, last_name, birthday, address, id_file, profile_picture) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$user_id, $firstName, $middleName, $lastName, $birthday, $address, $idFilePath, $profilePicPath]);
        } else {
            echo json_encode(["error" => "User profile already exists"]);
            exit();
        }

        // ✅ Fetch and return updated profile data
        $stmt = $pdo->prepare("SELECT u.username, u.barangay_id, up.first_name, up.middle_name, up.last_name, 
                                      up.birthday, up.address, up.id_file, up.profile_picture 
                               FROM users u 
                               LEFT JOIN user_profiles up ON u.id = up.user_id 
                               WHERE u.id = ?");
        $stmt->execute([$user_id]);
        $newUser = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode(["success" => "User profile created successfully", "user" => $newUser]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
