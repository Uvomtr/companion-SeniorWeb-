<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'config/db.php';
session_start();

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not authenticated"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user_id = $_SESSION["user_id"];
    $firstName = $_POST["firstName"] ?? '';
    $middleName = $_POST["middleName"] ?? '';
    $lastName = $_POST["lastName"] ?? '';
    $birthday = $_POST["birthday"] ?? '';
    $address = $_POST["address"] ?? '';

    // Ensure the uploads directory exists
    $uploadDir = "uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Handle file uploads securely
    $idFile = null;
    $profilePicture = null;

    function uploadFile($file, $uploadDir, $allowedTypes)
    {
        $fileName = basename($file["name"]);
        $filePath = $uploadDir . $fileName;
        $fileType = mime_content_type($file["tmp_name"]);

        // Validate file type
        if (!in_array($fileType, $allowedTypes)) {
            echo json_encode(["success" => false, "message" => "Invalid file type: $fileName"]);
            exit;
        }

        // Move file to destination
        if (move_uploaded_file($file["tmp_name"], $filePath)) {
            return $filePath;
        }
        return null;
    }

    $allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!empty($_FILES["idFile"]["name"])) {
        $idFile = uploadFile($_FILES["idFile"], $uploadDir, $allowedImageTypes);
    }
    if (!empty($_FILES["profilePicture"]["name"])) {
        $profilePicture = uploadFile($_FILES["profilePicture"], $uploadDir, $allowedImageTypes);
    }

    // Insert into `profile_edits` table
    $stmt = $pdo->prepare("INSERT INTO profile_edits (user_id, firstName, middleName, lastName, birthday, address, idFile, profilePicture) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    if ($stmt->execute([$user_id, $firstName, $middleName, $lastName, $birthday, $address, $idFile, $profilePicture])) {
        echo json_encode(["success" => true, "message" => "Profile edit submitted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error"]);
    }
} else {
    echo json_encode(["error" => "Invalid request"]);
}
?>
