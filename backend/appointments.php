<?php
session_start(); // Start the session at the beginning of the script

// Enable CORS and allow credentials
header("Access-Control-Allow-Origin: http://localhost:5173"); // Adjust the origin to your frontend
header("Access-Control-Allow-Credentials: true"); // Allow credentials (cookies)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
require_once 'config/db.php';

// Enhanced error logging
error_log("=== APPOINTMENTS.PHP DEBUG START ===");
error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);
error_log("SESSION: " . json_encode($_SESSION));

// Function to check if the user is logged in
function check_user_logged_in() {
    if (!isset($_SESSION['username'])) {
        error_log("User not logged in - no username in session");
        echo json_encode(["success" => false, "message" => "User not logged in"]);
        exit;
    }
    error_log("User logged in: " . $_SESSION['username']);
}

// Ensure the user is logged in before performing any actions
check_user_logged_in();

// Get the user ID from the database based on the username in the session
function get_user_id($pdo, $username) {
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            error_log("User not found in database: $username");
            return null;
        }
        
        error_log("User ID found: " . $user['id'] . " for username: $username");
        return $user['id'];
    } catch (PDOException $e) {
        error_log("Database error getting user ID: " . $e->getMessage());
        return null;
    }
}

// Get the user ID for the current logged-in user
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : get_user_id($pdo, $_SESSION['username']);
error_log("Using user_id: " . $user_id);

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User not found in database"]);
    exit;
}

// Handle POST request for creating a new appointment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    error_log("POST data: " . json_encode($data));
    
    if (empty($data['service']) || empty($data['date']) || empty($data['time'])) {
        error_log("Missing required fields in POST data");
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $service = htmlspecialchars($data['service']);
    $date = $data['date'];
    $time_input = $data['time'];
    
    // Convert time format from "9:00 AM" to MySQL TIME format "09:00:00"
    $timeObj = DateTime::createFromFormat('g:i A', $time_input);
    if ($timeObj) {
        $time = $timeObj->format('H:i:s'); // Convert to MySQL TIME format
        error_log("Time converted from '$time_input' to '$time'");
    } else {
        $time = $time_input; // Fallback if parsing fails
        error_log("Time parsing failed for '$time_input', using as is");
    }
    
    $status = "pending"; // Default status is 'pending'

    try {
        // Debug output before insertion
        error_log("Attempting to insert: Service=$service, Date=$date, Time=$time, Status=$status, UserID=$user_id");
        
        // Now try the actual insert with the real values
        $stmt = $pdo->prepare("INSERT INTO appointments (service, date, time, status, user_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$service, $date, $time, $status, $user_id]);
        error_log("Actual insert successful");
        
        echo json_encode(["success" => true, "message" => "Appointment booked successfully"]);
    } catch (PDOException $e) {
        $errorCode = $e->getCode();
        $errorMessage = $e->getMessage();
        error_log("Database error code: $errorCode - $errorMessage");
        
        // Generate the SQL that would have been executed for debugging
        $sql = "INSERT INTO appointments (service, date, time, status, user_id) VALUES ('$service', '$date', '$time', '$status', $user_id)";
        error_log("Failed SQL: $sql");
        
        echo json_encode([ 
            "success" => false, 
            "message" => "Database error", 
            "debug_message" => $errorMessage,
            "debug_code" => $errorCode,
            "debug_sql" => $sql
        ]);
    }
    exit;
}

// Handle GET request for retrieving appointments with status filter (approved, pending)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        error_log("Fetching appointments for user_id: $user_id");
        
        // Check if there's a 'status' query parameter to filter by (approved, pending)
        $status = isset($_GET['status']) ? $_GET['status'] : null;

        // Prepare the SQL query with optional status filter
        $sql = "SELECT id, service, date, time, status, remarks FROM appointments WHERE user_id = ?";
        if ($status) {
            $sql .= " AND status = ?";
        }
        $sql .= " ORDER BY date, time";

        $stmt = $pdo->prepare($sql);

        // Execute query with or without status filter
        if ($status) {
            $stmt->execute([$user_id, $status]);
        } else {
            $stmt->execute([$user_id]);
        }

        $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        error_log("Found " . count($appointments) . " appointments");

        // Format time back to AM/PM format for frontend display
        foreach ($appointments as &$appointment) {
            // Convert MySQL time format to user-friendly format
            $timeObj = DateTime::createFromFormat('H:i:s', $appointment['time']);
            if ($timeObj) {
                $appointment['time'] = $timeObj->format('g:i A');
            }
            
            // Format date to be more readable if needed
            $dateObj = DateTime::createFromFormat('Y-m-d', $appointment['date']);
            if ($dateObj) {
                $appointment['date'] = $dateObj->format('F j, Y'); // e.g., "March 15, 2023"
            }
        }
        
        echo json_encode(["success" => true, "appointments" => $appointments]);
    } catch (PDOException $e) {
        $errorCode = $e->getCode();
        $errorMessage = $e->getMessage();
        error_log("Database error on GET: $errorCode - $errorMessage");
        
        echo json_encode([ 
            "success" => false, 
            "message" => "Database error", 
            "debug_message" => $errorMessage,
            "debug_code" => $errorCode
        ]);
    }
    exit;
}

error_log("=== APPOINTMENTS.PHP DEBUG END ===");
http_response_code(405);
echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
?>
