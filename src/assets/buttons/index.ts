// Tệp này dùng để định nghĩa hình ảnh cho các nút điều khiển.
// Để sử dụng hình ảnh thực tế:
// 1. Thêm tệp hình ảnh (.png) vào thư mục này (src/assets/buttons/).
// 2. Bỏ chú thích (uncomment) dòng tương ứng và sửa tên tệp hình ảnh nếu cần.
// 3. Ứng dụng sẽ tự động ưu tiên hiển thị hình ảnh thay vì icon mặc định.

export const buttonImages: Record<string, any> = {
    // --- ĐI BỘ (On Foot) ---
    //'WIDGET_POSITION_PHONE': require('./phone.png'),                   // Điện thoại
    'WIDGET_POSITION_ENTER_CAR': require('./enter_car.png'),           // Vào xe
    'WIDGET_POSITION_BUTTON_SPRINT_AND_SWIM': require('./sprint.png'), // Chạy/Bơi
    'WIDGET_POSITION_SPRINT_AND_BASKETBALL_JUMP': require('./jump.png'), // Nhảy
    // 'WIDGET_POSITION_PED_MOVE': require('./analog.png'),               // Di chuyển (Analog)

    // --- CHIẾN ĐẤU (Combat) ---
    'WIDGET_POSITION_VC_SHOOT': require('./fire.png'),                 // Bắn/Đấm (Nút chính)
    'WIDGET_POSITION_VC_SHOOT_ALT': require('./shoot.png'),            // Bắn (Nút phụ)
    'WIDGET_POSITION_TARGETING_AND_ATTACK': require('./aim.png'),      // Ngắm
    'WIDGET_POSITION_SWAP_WEAPONS': require('./swap.png'),             // Đổi súng
    // 'WIDGET_POSITION_SHOOT_LOOK': require('./look.png'),               // Nhìn khi bắn

    // --- LÁI XE (Vehicle) ---
    'WIDGET_POSITION_ACCELERATE': require('./gas.png'),                // Ga
    'WIDGET_POSITION_BRAKE': require('./brake.png'),                   // Phanh
    'WIDGET_POSITION_VEHICLE_STEER_LEFT': require('./left.png'),       // Trái
    'WIDGET_POSITION_VEHICLE_STEER_RIGHT': require('./right.png'),      // Phải
    'WIDGET_POSITION_VEHICLE_STEER_ANALOG': require('./wheel.png'),    // Vô lăng
    'WIDGET_POSITION_HORN': require('./horn.png'),                     // Còi
    'WIDGET_POSITION_HORN_ALT': require('./horn.png'),                 // Còi phụ
    'WIDGET_POSITION_HANDBRAKE_AND_AIR_SHOOT': require('./handbrake.png'), // Phanh tay
    'WIDGET_POSITION_CAM_TOGGLE': require('./camera.png'),             // Đổi camera
    'WIDGET_POSITION_CAR_SHOOT': require('./driveby.png'),             // Bắn trên xe
    'WIDGET_POSITION_VEHICLE_SHOOT_LEFT': require('./driveby_left.png'), // Bắn trái
    'WIDGET_POSITION_VEHICLE_SHOOT_RIGHT': require('./driveby_right.png'), // Bắn phải
    'WIDGET_POSITION_HYDRAULICS': require('./hydraulics.png'),         // Nhún nhảy (Hydraulics)

    // --- KHÁC (Misc) ---
    'WIDGET_POSITION_RADAR': require('./radar.png'),                   // Bản đồ nhỏ
    // 'WIDGET_POSITION_HELP_TEXT': require('./help.png'),                // Trợ giúp
    // 'WIDGET_POSITION_SKIP_CUTSCENE': require('./skip.png'),            // Bỏ qua cutscene
};
