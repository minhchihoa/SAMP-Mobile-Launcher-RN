<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Load database config from news/api.php
$api_path = __DIR__ . '/news/api.php';

if (file_exists($api_path)) {
    ob_start(); // Start buffering
    include $api_path;
    ob_end_clean(); // Discard output (JSON)
} else {
    // Fallback or Error
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Missing news/api.php']);
    exit;
}

// Check Secret Key
$secret_key = $_POST['key'] ?? '';
$config_secret = 'gsvn2026vip'; // Should match UPLOAD_SECRET in .env

if ($secret_key !== $config_secret) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Invalid Secret Key']);
    exit;
}

// Get Data
$version = $_POST['version'] ?? '';
$description = $_POST['description'] ?? '';
$changed_files = $_POST['changed_files'] ?? '';
$author = $_POST['author'] ?? 'Trae'; // Default to Trae if not specified

if (empty($version)) {
    echo json_encode(['status' => 'error', 'message' => 'Version is required']);
    exit;
}

try {
    // Create table if not exists
    $sql_create = "CREATE TABLE IF NOT EXISTS `build_logs` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `version` varchar(50) NOT NULL,
        `description` text,
        `changed_files` text,
        `author` varchar(50) DEFAULT 'Trae',
        `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    
    $conn->exec($sql_create);

    // Check for duplicate log (same version and description within last minute)
    $stmt_check = $conn->prepare("SELECT id FROM build_logs WHERE version = :version AND description = :description AND created_at > (NOW() - INTERVAL 1 MINUTE)");
    $stmt_check->execute([
        ':version' => $version,
        ':description' => $description
    ]);
    
    if ($stmt_check->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Build log skipped (duplicate entry)']);
        exit;
    }

    // Insert log
    $stmt = $conn->prepare("INSERT INTO `build_logs` (version, description, changed_files, author) VALUES (:version, :description, :changed_files, :author)");
    $stmt->execute([
        ':version' => $version,
        ':description' => $description,
        ':changed_files' => $changed_files,
        ':author' => $author
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Build log saved successfully']);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>