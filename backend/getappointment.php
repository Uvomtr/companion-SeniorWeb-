<?php
// Enable error reporting for debugging (remove in production)
error_reporting(0); // Disable error reporting in the response
ini_set('display_errors', 0); // Don't display errors

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

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Connection failed: " . $conn->connect_error
    ]);
    exit;
}

try {
    // Get appointments - using try/catch to prevent errors from breaking JSON
    $appointments = [];
    
    // Check if the appointments table exists
    $tableCheckQuery = "SHOW TABLES LIKE 'appointments'";
    $tableResult = $conn->query($tableCheckQuery);
    
    if ($tableResult->num_rows > 0) {
        // Table exists, proceed with the query
        $appointmentsQuery = "SELECT a.id, 
                             COALESCE(u.username, 'Unknown User') as username, 
                             COALESCE(a.service, 'N/A') as service, 
                             a.date, a.time, a.status 
                      FROM appointments a 
                      LEFT JOIN users u ON a.user_id = u.id 
                      ORDER BY a.date DESC, a.time ASC";

        $appointmentsResult = $conn->query($appointmentsQuery);
        
        if ($appointmentsResult && $appointmentsResult->num_rows > 0) {
            while($row = $appointmentsResult->fetch_assoc()) {
                $appointments[] = $row;
            }
        }
    }
    
    // Initialize summary values with safe defaults
    $totalPatients = 0;
    $patientPercentChange = 0;
    $totalAppointments = count($appointments);
    $appointmentPercentChange = 0;
    $totalInquiries = 0;
    $inquiryPercentChange = 0;

    // Get total patients if table exists
    if ($tableResult->num_rows > 0) {
        $totalPatientsQuery = "SELECT COUNT(DISTINCT user_id) as total FROM appointments";
        $totalPatientsResult = $conn->query($totalPatientsQuery);
        if ($totalPatientsResult && $totalPatientsResult->num_rows > 0) {
            $totalPatients = $totalPatientsResult->fetch_assoc()['total'];
        }
    }

    // Get monthly stats for percentage changes
    $currentMonth = date('m');
    $previousMonth = $currentMonth - 1 > 0 ? $currentMonth - 1 : 12;
    $currentYear = date('Y');
    $previousYear = $previousMonth == 12 ? $currentYear - 1 : $currentYear;

    // Safe queries with table existence checking
    if ($tableResult->num_rows > 0) {
        // Current month appointments
        $currentMonthQuery = "SELECT COUNT(*) as total FROM appointments 
                             WHERE MONTH(date) = $currentMonth AND YEAR(date) = $currentYear";
        $currentMonthResult = $conn->query($currentMonthQuery);
        $currentMonthAppointments = $currentMonthResult && $currentMonthResult->num_rows > 0 ? 
                                    $currentMonthResult->fetch_assoc()['total'] : 0;

        // Previous month appointments
        $previousMonthQuery = "SELECT COUNT(*) as total FROM appointments 
                              WHERE MONTH(date) = $previousMonth AND YEAR(date) = $previousYear";
        $previousMonthResult = $conn->query($previousMonthQuery);
        $previousMonthAppointments = $previousMonthResult && $previousMonthResult->num_rows > 0 ? 
                                    $previousMonthResult->fetch_assoc()['total'] : 0;

        // Calculate percentage change
        if ($previousMonthAppointments > 0) {
            $appointmentPercentChange = round((($currentMonthAppointments - $previousMonthAppointments) / $previousMonthAppointments) * 100);
        }

        // Get patient percentage change
        $currentMonthPatientsQuery = "SELECT COUNT(DISTINCT user_id) as total FROM appointments 
                                     WHERE MONTH(date) = $currentMonth AND YEAR(date) = $currentYear";
        $currentMonthPatientsResult = $conn->query($currentMonthPatientsQuery);
        $currentMonthPatients = $currentMonthPatientsResult && $currentMonthPatientsResult->num_rows > 0 ? 
                               $currentMonthPatientsResult->fetch_assoc()['total'] : 0;

        $previousMonthPatientsQuery = "SELECT COUNT(DISTINCT user_id) as total FROM appointments 
                                      WHERE MONTH(date) = $previousMonth AND YEAR(date) = $previousYear";
        $previousMonthPatientsResult = $conn->query($previousMonthPatientsQuery);
        $previousMonthPatients = $previousMonthPatientsResult && $previousMonthPatientsResult->num_rows > 0 ? 
                                $previousMonthPatientsResult->fetch_assoc()['total'] : 0;

        if ($previousMonthPatients > 0) {
            $patientPercentChange = round((($currentMonthPatients - $previousMonthPatients) / $previousMonthPatients) * 100);
        }
    }

    // Check if inquiries table exists
    $inquiriesTableCheckQuery = "SHOW TABLES LIKE 'inquiries'";
    $inquiriesTableResult = $conn->query($inquiriesTableCheckQuery);
    
    if ($inquiriesTableResult && $inquiriesTableResult->num_rows > 0) {
        // Get total inquiries
        $totalInquiriesQuery = "SELECT COUNT(*) as total FROM inquiries";
        $totalInquiriesResult = $conn->query($totalInquiriesQuery);
        
        if ($totalInquiriesResult && $totalInquiriesResult->num_rows > 0) {
            $totalInquiries = $totalInquiriesResult->fetch_assoc()['total'];
            
            // Current month inquiries
            $currentMonthInquiriesQuery = "SELECT COUNT(*) as total FROM inquiries 
                                         WHERE MONTH(created_at) = $currentMonth AND YEAR(created_at) = $currentYear";
            $currentMonthInquiriesResult = $conn->query($currentMonthInquiriesQuery);
            $currentMonthInquiries = $currentMonthInquiriesResult && $currentMonthInquiriesResult->num_rows > 0 ? 
                                    $currentMonthInquiriesResult->fetch_assoc()['total'] : 0;
            
            // Previous month inquiries
            $previousMonthInquiriesQuery = "SELECT COUNT(*) as total FROM inquiries 
                                          WHERE MONTH(created_at) = $previousMonth AND YEAR(created_at) = $previousYear";
            $previousMonthInquiriesResult = $conn->query($previousMonthInquiriesQuery);
            $previousMonthInquiries = $previousMonthInquiriesResult && $previousMonthInquiriesResult->num_rows > 0 ? 
                                     $previousMonthInquiriesResult->fetch_assoc()['total'] : 0;
            
            if ($previousMonthInquiries > 0) {
                $inquiryPercentChange = round((($currentMonthInquiries - $previousMonthInquiries) / $previousMonthInquiries) * 100);
            }
        }
    }

    // Prepare the response
    $response = [
        "success" => true,
        "appointments" => $appointments,
        "summary" => [
            "totalPatients" => $totalPatients,
            "patientPercentChange" => $patientPercentChange,
            "totalAppointments" => $totalAppointments,
            "appointmentPercentChange" => $appointmentPercentChange,
            "totalInquiries" => $totalInquiries,
            "inquiryPercentChange" => $inquiryPercentChange
        ]
    ];

    echo json_encode($response);
} catch (Exception $e) {
    // If any error occurs, return a properly formatted JSON response
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}

// Close the connection
$conn->close();
?>