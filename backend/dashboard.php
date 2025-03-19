<?php
// dashboard.php - Admin dashboard overview
include 'config/db.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$totalUsers = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$totalAppointments = $pdo->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
$totalEvents = $pdo->query("SELECT COUNT(*) FROM events")->fetchColumn();
$pendingAppointments = $pdo->query("SELECT COUNT(*) FROM appointments WHERE status = 'pending'")->fetchColumn();

$response = [
    'success' => true,
    'data' => [
        'totalUsers' => $totalUsers,
        'totalAppointments' => $totalAppointments,
        'totalEvents' => $totalEvents,
        'pendingAppointments' => $pendingAppointments
    ]
];

echo json_encode($response);
?>