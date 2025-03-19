<?php
// Enable CORS for frontend communication (Adjust frontend URL as needed)
header("Access-Control-Allow-Origin: http://localhost:5173"); // Adjust for frontend
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Allow session cookies
header("Content-Type: application/json");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Start the session
session_start();

// Require database connection
require_once 'config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        // Handle login request
        $data = json_decode(file_get_contents('php://input'), true);
        $username = trim($data['username'] ?? '');
        $password = trim($data['password'] ?? '');

        if (empty($username) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Username and password are required']);
            exit;
        }

        // Query user from the database
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verify password
        if ($user && password_verify($password, $user['password'])) {
            // Regenerate session ID to prevent session fixation attacks
            session_regenerate_id(true);

            // Store user data in session
            $_SESSION['user_id'] = $user['id']; // Store user ID
            $_SESSION['username'] = $user['username']; // Store username
            $_SESSION['role'] = $user['role'];

            // Debugging session data
            error_log("Session username: " . $_SESSION['username']); // Check session value
            error_log("Session user_id: " . $_SESSION['user_id']); // Check user_id value

            // Ensure session is written
            session_write_close();

            // Respond with user info (excluding password)
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role'],
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    } elseif ($method === 'GET') {
        if (isset($_SESSION['username'])) {
            // Fetch seniors' data
            $stmt = $pdo->query("SELECT id, username, age, sex, address, health_issue FROM seniors");
            $seniors = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'username' => $_SESSION['username'],
                    'role' => $_SESSION['role'],
                ],
                'seniors' => $seniors
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Not logged in']);
        }
    } elseif ($method === 'DELETE') {
        // Logout user
        session_unset(); // Clear session variables
        session_destroy(); // Destroy session

        // Clear session cookies
        setcookie(session_name(), '', time() - 3600, '/'); // Clear the session cookie

        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    } else {
        echo json_encode(['error' => 'Invalid request']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
