CREATE DATABASE `shopping_portal` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `product` (
  `id` bigint(20) NOT NULL,
  `product_name` varchar(45),
  `added_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `user` (
  `id` bigint(11) NOT NULL,
  `user_name` varchar(45) NOT NULL,
  `user_type` char(1) DEFAULT 'N',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `inventory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `unit_price` decimal(10,4) DEFAULT NULL,
  `quantity` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `_idx` (`product_id`),
  KEY `user_fk_idx` (`user_id`),
  CONSTRAINT `product_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `unit_price` decimal(10,4) DEFAULT NULL,
  `quantity` bigint(20) DEFAULT NULL,
  `order_total` decimal(10,4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_fk_idx` (`product_id`),
  KEY `user_fk_idx` (`user_id`),
  CONSTRAINT `order_product_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `order_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `shopping_portal`.`product`(`id`,`product_name`)
VALUES(1, "Motorola Moto E"),
 (2, "Iphone 6s"),
 (3, "Cello Pen"),
 (4, "Intex headset"),
 (5, "Titanic watch"),
 (6, "Fasttrack bagpack"),
 (7, "Xbox console"),
 (8, "Arrow shirt");
