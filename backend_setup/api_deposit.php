<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username_db = "root";
$password_db = "Anhnhoem22@22";
$dbname = "gta";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Helper function to get settings
function getSettings($conn) {
    $sql = "SELECT * FROM `kncms_settings` LIMIT 1";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    return [];
}

// Helper function to get user ID
function getUserId($conn, $username) {
    $username = $conn->real_escape_string($username);
    $sql = "SELECT id FROM `accounts` WHERE `Username` = '$username'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['id'];
    }
    return null;
}

// Helper function for API call
function curl_get($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Handle HTTPS
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

// Get action
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'get_info') {
    $settings = getSettings($conn);
    // Return safe settings
    $data = [
        "momo_phone" => $settings['SDTMOMO'] ?? "0368.56.3456",
        "momo_owner" => $settings['OwnerMOMO'] ?? "NGUYEN HOANG NAM",
        "acb_account" => "19446451", // Hardcoded from trans.php
        "acb_owner" => $settings['OwnerMOMO'] ?? "NGUYEN HOANG NAM",
        "server_api" => $settings['ServerAPI'] ?? ''
    ];
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
} elseif ($action == 'deposit_card') {
    $input = json_decode(file_get_contents("php://input"), true);
    
    $username = $input['username'] ?? '';
    $telco = $input['telco'] ?? '';
    $amount = $input['amount'] ?? '';
    $serial = $input['serial'] ?? '';
    $code = $input['code'] ?? '';

    if (empty($username) || empty($telco) || empty($amount) || empty($serial) || empty($code)) {
        echo json_encode(["error" => "Vui lòng nhập đầy đủ thông tin"]);
        exit;
    }

    $uid = getUserId($conn, $username);
    if (!$uid) {
        echo json_encode(["error" => "Tên tài khoản không tồn tại"]);
        exit;
    }

    $ranid  = rand(100009, 999999);
    $partner_id = "23862181441";
    $partner_key = "c26d26e8388bb5b5979cb2b96f0f2495";
    
    $url = 'https://doithe1s.vn/chargingws/v2?sign='.md5($partner_key.$code.$serial).'&telco='.$telco.'&code='.$code.'&serial='.$serial.'&amount='.$amount.'&request_id='.$ranid.'&partner_id='.$partner_id.'&command=charging';
    
    $data = curl_get($url);
    $result = json_decode($data, true);
    
    // Default status if null
    $status = $result['status'] ?? 999;
    
    // Get Server Card logic (simplified or fetched from settings)
    $settings = getSettings($conn);
    $server_api = $settings['ServerAPI'] ?? 'default';

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO `kncms_napthe` (`type`, `amount`, `serial`, `code`, `status`, `uid`, `server_api`, `mgd`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssiisi", $telco, $amount, $serial, $code, $status, $uid, $server_api, $ranid);
    
    if ($stmt->execute()) {
        if ($status == 100) {
            echo json_encode(["error" => $result['message'] ?? "Lỗi không xác định"], JSON_UNESCAPED_UNICODE);
        } elseif ($status == 1) {
            echo json_encode(["success" => "Nạp thẻ thành công"], JSON_UNESCAPED_UNICODE);
        } elseif ($status == 2) {
            echo json_encode(["error" => "Sai mệnh giá thẻ"], JSON_UNESCAPED_UNICODE);
        } elseif ($status == 3) {
            echo json_encode(["error" => "Vui lòng kiểm tra lại thẻ"], JSON_UNESCAPED_UNICODE);
        } elseif ($status == 4) {
            echo json_encode(["error" => "Server API bảo trì"], JSON_UNESCAPED_UNICODE);
        } elseif ($status == 99) {
            echo json_encode(["success" => "Gửi thẻ thành công, đang chờ duyệt"], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["error" => $result['message'] ?? "Lỗi không xác định"], JSON_UNESCAPED_UNICODE);
        }
    } else {
        echo json_encode(["error" => "Lỗi cơ sở dữ liệu: " . $stmt->error], JSON_UNESCAPED_UNICODE);
    }
    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid action"]);
}

$conn->close();
?>