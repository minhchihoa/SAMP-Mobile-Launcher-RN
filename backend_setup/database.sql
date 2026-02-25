CREATE TABLE IF NOT EXISTS `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `news` (`title`, `image`, `link`, `description`, `created_at`) VALUES
('Chào mừng máy chủ mới', 'https://i.imgur.com/example1.jpg', 'https://gtasan.vn', 'Thông báo ra mắt máy chủ...', NOW()),
('Sự kiện đua xe', 'https://i.imgur.com/example2.jpg', NULL, 'Tham gia ngay sự kiện...', NOW());
