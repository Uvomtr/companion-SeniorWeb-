<?php
// events.php - Event Management
include 'config/db.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch all events
    $stmt = $pdo->query("SELECT * FROM events ORDER BY date_time ASC");
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($events);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'];
    $event_title = $data['event_title'];
    $event_description = $data['event_description'];
    $date_time = $data['date_time'];

    $stmt = $pdo->prepare("INSERT INTO events (user_id, event_title, event_description, date_time) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$user_id, $event_title, $event_description, $date_time])) {
        echo json_encode(['success' => true, 'message' => 'Event created successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create event']);
    }
}

// Admin updates event
if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $event_id = $data['id'];
    $event_title = $data['event_title'];
    $event_description = $data['event_description'];
    $date_time = $data['date_time'];

    $stmt = $pdo->prepare("UPDATE events SET event_title = ?, event_description = ?, date_time = ? WHERE id = ?");
    if ($stmt->execute([$event_title, $event_description, $date_time, $event_id])) {
        echo json_encode(['success' => true, 'message' => 'Event updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update event']);
    }
}
?>
