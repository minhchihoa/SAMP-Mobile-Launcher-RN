<?php
// Database Configuration
$host = 'localhost';
$db_name = 'your_database_name'; // Thay bằng tên database của bạn
$username = 'your_username';     // Thay bằng username database
$password = 'your_password';     // Thay bằng password database

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // If connection fails, we can't do much. 
    // In API context, return empty JSON. In HTML context, show error.
    // For now, let the caller handle the error or check $conn
}
?>