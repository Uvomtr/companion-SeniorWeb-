<?php
// events.php - Event Management API
include 'config/db.php';

// Set headers for JSON response and CORS
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch all events
    try {
        $stmt = $pdo->query("SELECT * FROM events ORDER BY date_time ASC");
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'events' => $events]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch events', 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    // Get input data
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($data['organizer']) || empty($data['event_title']) || empty($data['event_description']) || empty($data['date_time']) || empty($data['location'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    // Insert new event
    try {
        $stmt = $pdo->prepare("INSERT INTO events (organizer, event_title, event_description, date_time, location) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['organizer'], $data['event_title'], $data['event_description'], $data['date_time'], $data['location']]);
        
        echo json_encode(['success' => true, 'message' => 'Event created successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to create event', 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'PUT') {
    // Get input data
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($data['id']) || empty($data['organizer']) || empty($data['event_title']) || empty($data['event_description']) || empty($data['date_time']) || empty($data['location'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    // Update event
    try {
        $stmt = $pdo->prepare("UPDATE events SET organizer = ?, event_title = ?, event_description = ?, date_time = ?, location = ? WHERE id = ?");
        $stmt->execute([$data['organizer'], $data['event_title'], $data['event_description'], $data['date_time'], $data['location'], $data['id']]);

        echo json_encode(['success' => true, 'message' => 'Event updated successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to update event', 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    // Get input data
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'Missing event ID']);
        exit;
    }

    // Delete event
    try {
        $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
        $stmt->execute([$data['id']]);

        echo json_encode(['success' => true, 'message' => 'Event deleted successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to delete event', 'error' => $e->getMessage()]);
    }
    exit;
}

// Invalid request method
echo json_encode(['success' => false, 'message' => 'Invalid request method']);
exit;
?>
