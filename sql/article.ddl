CREATE TABLE `article` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `author_id` int(8) unsigned NOT NULL,
  `title` varchar(20) NOT NULL DEFAULT '',
  `filename` varchar(20) NOT NULL,
  `status` enum('draft','issue') DEFAULT 'draft',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8