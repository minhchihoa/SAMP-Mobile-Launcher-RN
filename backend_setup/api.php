<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Cấu hình Database
require_once __DIR__ . '/db_config.php';

if (!isset($conn)) {
    echo json_encode([]);
    exit;
}

// Lấy danh sách tin tức
$stmt = $conn->prepare("SELECT title, image, link, slug, description, DATE_FORMAT(created_at, '%d/%m/%Y') as created_at FROM news ORDER BY created_at DESC");
$stmt->execute();
$news = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Đảm bảo trả về mảng rỗng nếu không có dữ liệu
if (!$news) {
    $news = [];
}

// Handle JSON encoding errors (e.g., malformed UTF-8 characters)
$json = json_encode($news, JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR);
if ($json === false) {
    echo json_encode([]);
} else {
    echo $json;
}
?>
