<?php
session_start();

// --- CONFIGURATION ---
// CHANGE THESE CREDENTIALS!
$config_username = 'admin'; 
$config_password = '8112008Minh'; 

// --- AUTHENTICATION LOGIC ---

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: ' . basename($_SERVER['PHP_SELF']));
    exit;
}

// Handle Login Submission
$login_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['do_login'])) {
    $user = isset($_POST['username']) ? $_POST['username'] : '';
    $pass = isset($_POST['password']) ? $_POST['password'] : '';

    if ($user === $config_username && $pass === $config_password) {
        $_SESSION['logged_in'] = true;
        // Redirect to self to remove POST data
        header('Location: ' . basename($_SERVER['PHP_SELF']));
        exit;
    } else {
        $login_error = 'Sai tên đăng nhập hoặc mật khẩu!';
    }
}

// Check if Logged In
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    // Show Login Form
    ?>
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - File Manager</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f0f2f5; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .login-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 350px; }
            h2 { text-align: center; color: #333; margin-top: 0; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; color: #555; }
            input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
            button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
            button:hover { background: #0056b3; }
            .error { color: #dc3545; background: #f8d7da; padding: 10px; border-radius: 4px; margin-bottom: 15px; text-align: center; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h2>Đăng Nhập</h2>
            <?php if ($login_error): ?>
                <div class="error"><?php echo htmlspecialchars($login_error); ?></div>
            <?php endif; ?>
            <form method="POST">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" required autofocus>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
                <button type="submit" name="do_login">Login</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit; // Stop execution if not logged in
}

// --- FILE MANAGER LOGIC (Protected) ---

// mobile/manager.php

// 1. Cấu hình cơ bản
$base_dir = __DIR__; // Thư mục gốc được phép quản lý (mobile)
$script_name = basename(__FILE__);

// 2. Xử lý đường dẫn hiện tại (Navigation)
$rel_path = isset($_GET['dir']) ? $_GET['dir'] : '';
// Làm sạch đường dẫn để tránh Path Traversal
$rel_path = str_replace(array('../', '..\\'), '', $rel_path);
$rel_path = trim($rel_path, '/\\');

// Đường dẫn thực tế trên server
$current_path = $base_dir;
if ($rel_path !== '') {
    $current_path .= DIRECTORY_SEPARATOR . $rel_path;
}

// Kiểm tra nếu đường dẫn không tồn tại hoặc không nằm trong base_dir thì quay về root
if (!is_dir($current_path) || strpos(realpath($current_path), realpath($base_dir)) !== 0) {
    $current_path = $base_dir;
    $rel_path = '';
}

// Helper: Tạo URL
function makeUrl($action, $file = '', $dir = '') {
    global $script_name;
    $query = [];
    if ($dir !== '') $query['dir'] = $dir;
    if ($action !== 'list') $query['action'] = $action;
    if ($file !== '') $query['item'] = $file;
    return $script_name . '?' . http_build_query($query);
}

// 3. Xử lý Action (Create, Upload, Delete, Rename, Edit)
$msg = '';
$error = '';
$edit_mode = false;
$edit_content = '';
$edit_filename = '';

// -- Tạo thư mục mới --
if (isset($_POST['create_folder'])) {
    $new_folder_name = trim($_POST['folder_name']);
    if (!empty($new_folder_name)) {
        // Chỉ cho phép tên folder an toàn
        if (preg_match('/^[a-zA-Z0-9_\-\.]+$/', $new_folder_name)) {
            $new_folder_path = $current_path . DIRECTORY_SEPARATOR . $new_folder_name;
            if (!file_exists($new_folder_path)) {
                if (mkdir($new_folder_path)) {
                    $msg = "Đã tạo thư mục: $new_folder_name";
                } else {
                    $error = "Không thể tạo thư mục (kiểm tra quyền ghi).";
                }
            } else {
                $error = "Tên thư mục đã tồn tại.";
            }
        } else {
            $error = "Tên thư mục không hợp lệ (chỉ dùng chữ, số, _, -, .).";
        }
    }
}

// -- Upload File (Multi) --
if (isset($_FILES['file_upload'])) {
    $uploaded_files = $_FILES['file_upload'];
    $total_files = count($uploaded_files['name']);
    $success_count = 0;
    
    for ($i = 0; $i < $total_files; $i++) {
        if ($uploaded_files['error'][$i] === UPLOAD_ERR_OK) {
            $name = basename($uploaded_files['name'][$i]);
            $target_file = $current_path . DIRECTORY_SEPARATOR . $name;
            
            if (!file_exists($target_file)) {
                if (move_uploaded_file($uploaded_files['tmp_name'][$i], $target_file)) {
                    $success_count++;
                }
            } else {
                // File exist - skip or maybe add error for this specific file?
                // For now just skip
            }
        }
    }
    
    if ($success_count > 0) {
        $msg = "Đã upload thành công $success_count file.";
    } elseif ($total_files > 0) {
        $error = "Lỗi khi upload (có thể file đã tồn tại hoặc lỗi server).";
    }
}

// -- Rename Item --
if (isset($_POST['rename_item'])) {
    $old_name = $_POST['old_name'];
    $new_name = trim($_POST['new_name']);
    
    // Validate tên mới
    if (!empty($new_name) && $new_name !== $old_name && $old_name !== $script_name) {
        if (preg_match('/^[a-zA-Z0-9_\-\.]+$/', $new_name)) {
            $old_path = $current_path . DIRECTORY_SEPARATOR . $old_name;
            $new_path = $current_path . DIRECTORY_SEPARATOR . $new_name;
            
            if (file_exists($old_path)) {
                if (!file_exists($new_path)) {
                    if (rename($old_path, $new_path)) {
                        $msg = "Đã đổi tên: $old_name -> $new_name";
                    } else {
                        $error = "Không thể đổi tên.";
                    }
                } else {
                    $error = "Tên mới đã tồn tại.";
                }
            } else {
                $error = "File gốc không tồn tại.";
            }
        } else {
            $error = "Tên mới không hợp lệ (chỉ dùng chữ, số, _, -, .).";
        }
    }
}

// -- Delete Item --
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['item'])) {
    $item_name = $_GET['item'];
    // Validate tên item
    if (strpos($item_name, '/') === false && strpos($item_name, '\\') === false && $item_name !== '.' && $item_name !== '..') {
        $item_path = $current_path . DIRECTORY_SEPARATOR . $item_name;
        
        if ($item_name === $script_name) {
            $error = "Không thể xóa file quản lý này.";
        } elseif (file_exists($item_path)) {
            if (is_dir($item_path)) {
                if (@rmdir($item_path)) {
                    $msg = "Đã xóa thư mục: " . htmlspecialchars($item_name);
                } else {
                    $error = "Không thể xóa thư mục (thư mục phải rỗng).";
                }
            } else {
                if (unlink($item_path)) {
                    $msg = "Đã xóa file: " . htmlspecialchars($item_name);
                } else {
                    $error = "Không thể xóa file.";
                }
            }
        } else {
            $error = "Mục không tồn tại.";
        }
    } else {
        $error = "Tên mục không hợp lệ.";
    }
}

// -- Download File --
if (isset($_GET['action']) && $_GET['action'] === 'download' && isset($_GET['item'])) {
    $item_name = $_GET['item'];
    $item_path = $current_path . DIRECTORY_SEPARATOR . $item_name;

    if ($item_name === $script_name) {
        $error = "Không thể tải xuống file quản lý này.";
    } elseif (file_exists($item_path) && is_file($item_path)) {
        // Clear output buffer
        if (ob_get_level()) ob_end_clean();
        
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($item_path) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($item_path));
        readfile($item_path);
        exit;
    } else {
        $error = "File không tồn tại.";
    }
}

// -- Edit File Logic --
if (isset($_GET['action']) && $_GET['action'] === 'edit' && isset($_GET['item'])) {
    $item_name = $_GET['item'];
    $item_path = $current_path . DIRECTORY_SEPARATOR . $item_name;
    
    // Prevent editing the manager script itself
    if ($item_name === $script_name) {
        $error = "Không được phép chỉnh sửa file này.";
    } elseif (file_exists($item_path) && is_file($item_path)) {
        // Check if file is text/editable
        $ext = strtolower(pathinfo($item_name, PATHINFO_EXTENSION));
        $allowed_edit = ['txt', 'php', 'html', 'htm', 'css', 'js', 'json', 'xml', 'ini', 'log', 'cfg', 'dat', 'sql'];
        
        if (in_array($ext, $allowed_edit)) {
            $edit_mode = true;
            $edit_filename = $item_name;
            
            // Handle Save
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_file'])) {
                $content = $_POST['file_content'];
                if (file_put_contents($item_path, $content) !== false) {
                    $msg = "Đã lưu file: $item_name";
                } else {
                    $error = "Lỗi khi lưu file (kiểm tra quyền ghi).";
                }
                // Reload content
                $edit_content = file_get_contents($item_path);
            } else {
                // Load content
                $edit_content = file_get_contents($item_path);
            }
        } else {
            $error = "Định dạng file không hỗ trợ chỉnh sửa.";
        }
    } else {
        $error = "File không tồn tại.";
    }
}

// 4. Lấy danh sách file/folder (chỉ khi không edit)
$folders = [];
$files = [];

if (!$edit_mode) {
    $items = scandir($current_path);
    foreach ($items as $item) {
        if ($item === '.') continue;
        if ($item === '..' && $rel_path === '') continue; // Không hiện .. ở root
        if ($item === $script_name) continue; // Ẩn file quản lý

        // Hide mobile/news/api.php
        if ($rel_path === 'news' && $item === 'api.php') continue;
        if ($item === 'log_build.php') continue;
        
        $full_path = $current_path . DIRECTORY_SEPARATOR . $item;
        $is_dir = is_dir($full_path);
        
        $info = [
            'name' => $item,
            'path' => $full_path,
            'size' => $is_dir ? '-' : filesize($full_path),
            'mtime' => date("Y-m-d H:i:s", filemtime($full_path)),
            'perms' => substr(sprintf('%o', fileperms($full_path)), -4),
        ];

        if ($is_dir) {
            $folders[] = $info;
        } else {
            $files[] = $info;
        }
    }
}

// Format size helper
function formatSize($bytes) {
    if ($bytes === '-') return '-';
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, 2) . ' ' . $units[$pow];
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Manager - <?php echo htmlspecialchars($rel_path ? $rel_path : '/'); ?></title>
    <style>
        :root { --primary: #007bff; --bg: #f8f9fa; --border: #dee2e6; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); margin: 0; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        
        /* Header & Breadcrumb */
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        h1 { margin: 0; font-size: 20px; color: #333; }
        .nav-links a { margin-left: 15px; text-decoration: none; color: #555; font-weight: 500; }
        .nav-links a:hover { color: var(--primary); }
        .nav-links a.active { color: var(--primary); font-weight: bold; }
        .logout-btn { background: #dc3545; color: white; text-decoration: none; padding: 6px 12px; border-radius: 4px; font-size: 14px; margin-left: 15px; }
        .logout-btn:hover { background: #c82333; }
        
        /* Build Logs Table */
        .log-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .log-table th, .log-table td { padding: 12px; border: 1px solid #ddd; text-align: left; }
        .log-table th { background-color: #f8f9fa; }
        .log-version { font-weight: bold; color: var(--primary); }
        .log-author { font-style: italic; color: #666; }
        .log-desc { white-space: pre-line; }
        .log-date { color: #888; font-size: 0.9em; }

        .breadcrumb { padding: 10px; background: #e9ecef; border-radius: 4px; margin-bottom: 20px; }
        .breadcrumb a { text-decoration: none; color: var(--primary); }
        .breadcrumb span { color: #6c757d; }
        
        /* Toolbar */
        .toolbar { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; background: #fff; border: 1px solid var(--border); padding: 15px; border-radius: 4px; }
        .toolbar-group { display: flex; align-items: center; gap: 10px; }
        .btn { padding: 6px 12px; border: 1px solid transparent; border-radius: 4px; cursor: pointer; font-size: 14px; }
        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { background: #0056b3; }
        input[type="text"], input[type="file"] { padding: 6px; border: 1px solid #ced4da; border-radius: 4px; }
        
        /* Table */
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 12px; border-bottom: 1px solid var(--border); text-align: left; }
        th { background-color: #f8f9fa; font-weight: 600; }
        tr:hover { background-color: #f1f1f1; }
        
        /* Icons & Links */
        .icon { margin-right: 8px; width: 20px; text-align: center; display: inline-block; }
        .name-link { text-decoration: none; color: #333; font-weight: 500; display: flex; align-items: center; }
        .name-link:hover { color: var(--primary); }
        .folder { color: #f39c12; }
        .file { color: #95a5a6; }
        
        /* Alerts */
        .alert { padding: 10px; margin-bottom: 15px; border-radius: 4px; }
        .alert-success { background: #d4edda; color: #155724; }
        .alert-error { background: #f8d7da; color: #721c24; }
        
        /* Actions */
        .actions { display: flex; gap: 10px; }
        .actions a { color: #dc3545; text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 4px; border-radius: 4px; transition: background 0.2s; }
        .actions a:hover { background: rgba(0,0,0,0.05); }
        .actions a.rename-btn { color: #28a745; }
        .actions a.edit-btn { color: #007bff; }
        .actions a.download-btn { color: #17a2b8; }
        .actions svg { width: 18px; height: 18px; }

        /* Editor */
        .editor-container { margin-top: 20px; }
        textarea { width: 100%; height: 500px; padding: 10px; font-family: monospace; border: 1px solid #ced4da; border-radius: 4px; resize: vertical; box-sizing: border-box; }
        .editor-actions { margin-top: 10px; display: flex; gap: 10px; }
    </style>
    <script>
        function renameItem(oldName) {
            let newName = prompt("Nhập tên mới cho " + oldName + ":", oldName);
            if (newName && newName !== oldName) {
                document.getElementById('rename_old').value = oldName;
                document.getElementById('rename_new').value = newName;
                document.getElementById('rename_form').submit();
            }
        }
        function copyLink(filename) {
            // Construct absolute URL
            const url = window.location.href.split('?')[0].replace(/\/$/, '') + '/' + encodeURIComponent(filename);
            navigator.clipboard.writeText(url).then(() => {
                alert('Copied link: ' + url);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                prompt('Copy this link:', url);
            });
        }
    </script>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Admin Panel</h1>
        <div class="nav-links">
            <a href="<?php echo $script_name; ?>" class="<?php echo (!isset($_GET['view']) || $_GET['view'] !== 'logs') ? 'active' : ''; ?>">File Manager</a>
            <a href="?view=logs" class="<?php echo (isset($_GET['view']) && $_GET['view'] === 'logs') ? 'active' : ''; ?>">Build Logs</a>
            <a href="?action=logout" class="logout-btn">Đăng Xuất (<?php echo htmlspecialchars($config_username); ?>)</a>
        </div>
    </div>
    
    <?php if (isset($_GET['view']) && $_GET['view'] === 'logs'): ?>
        <!-- BUILD LOGS VIEW -->
        <?php
        // Fetch logs
        // Check for news/api.php to get DB connection
        // We use output buffering to suppress any JSON output from api.php
        $api_path = __DIR__ . '/news/api.php';
        
        if (file_exists($api_path)) {
            ob_start(); // Start buffering
            include $api_path;
            ob_end_clean(); // Discard output (JSON)
        } else {
             $error = "Không tìm thấy file kết nối database (news/api.php).";
        }

        if (isset($conn)) {
            try {
                // Ensure table exists
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

                $stmt = $conn->query("SELECT * FROM build_logs ORDER BY created_at DESC LIMIT 50");
                $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                $logs = [];
                $error = "Lỗi truy vấn Database: " . $e->getMessage();
            }
        } else {
            $logs = [];
            if (!isset($error)) $error = "Không thể kết nối Database.";
        }
        ?>
        
        <h2>Lịch sử Build APK</h2>
        <?php if (isset($error) && $error): ?> <div class="alert alert-error"><?php echo $error; ?></div> <?php endif; ?>
        
        <table class="log-table">
            <thead>
                <tr>
                    <th style="width: 15%">Version</th>
                    <th style="width: 20%">Thời gian</th>
                    <!-- <th style="width: 10%">Người build</th> -->
                    <th style="width: 45%">Nội dung thay đổi</th>
                    <th style="width: 20%">File thay đổi</th>
                </tr>
            </thead>
            <tbody>
                <?php if (count($logs) > 0): ?>
                    <?php foreach ($logs as $log): ?>
                        <tr>
                            <td class="log-version"><?php echo htmlspecialchars($log['version']); ?></td>
                            <td class="log-date"><?php echo date('d/m/Y H:i', strtotime($log['created_at'])); ?></td>
                            <!-- <td class="log-author"><?php echo htmlspecialchars($log['author']); ?></td> -->
                            <td class="log-desc"><?php echo nl2br(htmlspecialchars($log['description'])); ?></td>
                            <td style="font-size: 0.85em; color: #555;">
                                <?php 
                                    if ($log['changed_files']) {
                                        $files = explode("\n", $log['changed_files']);
                                        foreach ($files as $file) {
                                            echo '<div>📄 ' . htmlspecialchars($file) . '</div>';
                                        }
                                    } else {
                                        echo '<span style="color:#999">Không có thông tin</span>';
                                    }
                                ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr><td colspan="5" style="text-align: center; padding: 20px;">Chưa có dữ liệu log nào.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>

    <?php else: ?>
        <!-- FILE MANAGER VIEW -->
    
    <!-- Breadcrumb -->
    <div class="breadcrumb">
        Path: 
        <a href="<?php echo $script_name; ?>">Root</a>
        <?php
        if ($rel_path !== '') {
            $parts = explode('/', $rel_path);
            $path_accum = '';
            foreach ($parts as $part) {
                $path_accum .= ($path_accum === '' ? '' : '/') . $part;
                echo ' / <a href="?dir=' . urlencode($path_accum) . '">' . htmlspecialchars($part) . '</a>';
            }
        }
        ?>
    </div>

    <!-- Messages -->
    <?php if ($msg): ?> <div class="alert alert-success"><?php echo $msg; ?></div> <?php endif; ?>
    <?php if ($error): ?> <div class="alert alert-error"><?php echo $error; ?></div> <?php endif; ?>

    <?php if ($edit_mode): ?>
        <!-- EDITOR MODE -->
        <div class="editor-container">
            <h3>Editing: <?php echo htmlspecialchars($edit_filename); ?></h3>
            <form method="POST">
                <textarea name="file_content"><?php echo htmlspecialchars($edit_content); ?></textarea>
                <div class="editor-actions">
                    <button type="submit" name="save_file" class="btn btn-primary">Lưu Thay Đổi</button>
                    <a href="<?php echo makeUrl('list', '', $rel_path); ?>" class="btn" style="background: #6c757d; color: white; text-decoration: none;">Quay Lại</a>
                </div>
            </form>
        </div>
    <?php else: ?>
        <!-- LIST MODE -->
        
        <!-- Toolbar: Create Folder & Upload -->
        <div class="toolbar">
            <!-- Create Folder -->
            <form method="POST" class="toolbar-group">
                <label>New Folder:</label>
                <input type="text" name="folder_name" placeholder="Name..." required>
                <button type="submit" name="create_folder" class="btn btn-primary">Create</button>
            </form>

            <!-- Upload File -->
            <form method="POST" enctype="multipart/form-data" class="toolbar-group" style="border-left: 1px solid #ddd; padding-left: 20px;">
                <label>Upload:</label>
                <!-- Allow Multiple Files -->
                <input type="file" name="file_upload[]" multiple required>
                <button type="submit" class="btn btn-primary">Upload</button>
            </form>
        </div>

        <!-- Hidden Rename Form -->
        <form method="POST" id="rename_form" style="display:none;">
            <input type="hidden" name="rename_item" value="1">
            <input type="hidden" name="old_name" id="rename_old">
            <input type="hidden" name="new_name" id="rename_new">
        </form>

        <!-- File List -->
        <table>
            <thead>
                <tr>
                    <th style="width: 50%">Filename</th>
                    <th>Size</th>
                    <th>Permissions</th>
                    <th>Last Modified</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <!-- Folders -->
                <?php foreach ($folders as $item): ?>
                    <tr>
                        <td>
                            <?php if ($item['name'] === '..'): ?>
                                <a href="<?php echo makeUrl('list', '', dirname($rel_path) === '.' ? '' : dirname($rel_path)); ?>" class="name-link">
                                    <span class="icon folder">⬆️</span> ..
                                </a>
                            <?php else: ?>
                                <a href="<?php echo makeUrl('list', '', ($rel_path ? $rel_path . '/' : '') . $item['name']); ?>" class="name-link">
                                    <span class="icon folder">📁</span> <?php echo htmlspecialchars($item['name']); ?>
                                </a>
                            <?php endif; ?>
                        </td>
                        <td>-</td>
                        <td><?php echo $item['perms']; ?></td>
                        <td><?php echo $item['mtime']; ?></td>
                        <td class="actions">
                            <?php if ($item['name'] !== '..'): ?>
                                <a class="rename-btn" onclick="renameItem('<?php echo htmlspecialchars($item['name']); ?>')" title="Rename">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </a>
                                <a href="<?php echo makeUrl('delete', $item['name'], $rel_path); ?>" onclick="return confirm('Delete folder <?php echo htmlspecialchars($item['name']); ?>? (Must be empty)');" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </a>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>

                <!-- Files -->
                <?php foreach ($files as $item): ?>
                    <tr>
                        <td>
                            <a href="<?php echo ($rel_path ? $rel_path . '/' : '') . $item['name']; ?>" target="_blank" class="name-link">
                                <span class="icon file">📄</span> <?php echo htmlspecialchars($item['name']); ?>
                            </a>
                        </td>
                        <td><?php echo formatSize($item['size']); ?></td>
                        <td><?php echo $item['perms']; ?></td>
                        <td><?php echo $item['mtime']; ?></td>
                        <td class="actions">
                            <a href="<?php echo makeUrl('download', $item['name'], $rel_path); ?>" class="download-btn" title="Download">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            </a>
                            <?php 
                            $ext = strtolower(pathinfo($item['name'], PATHINFO_EXTENSION));
                            $editable = in_array($ext, ['txt', 'php', 'html', 'htm', 'css', 'js', 'json', 'xml', 'ini', 'log', 'cfg', 'dat', 'sql']);
                            ?>
                            
                            <?php if ($editable): ?>
                                <a href="<?php echo makeUrl('edit', $item['name'], $rel_path); ?>" class="edit-btn" title="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                </a>
                            <?php endif; ?>

                            <a class="rename-btn" onclick="renameItem('<?php echo htmlspecialchars($item['name']); ?>')" title="Rename">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </a>
                            <a class="copy-link-btn" onclick="copyLink('<?php echo htmlspecialchars($item['name']); ?>')" title="Copy Link" style="cursor:pointer; color: #6f42c1;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </a>
                            <a href="<?php echo makeUrl('delete', $item['name'], $rel_path); ?>" onclick="return confirm('Delete file <?php echo htmlspecialchars($item['name']); ?>?');" title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
                
                <?php if (empty($folders) && empty($files)): ?>
                    <tr><td colspan="5" style="text-align: center; color: #777;">Empty directory</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    <?php endif; ?>
    
    <?php endif; // End View Switch ?>
</div>

</body>
</html>
