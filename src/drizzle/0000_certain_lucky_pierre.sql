CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ref` text,
	`company` text,
	`category` text,
	`stock` integer DEFAULT 0 NOT NULL,
	`current_shipment_id` text,
	`retail_price` integer DEFAULT 0 NOT NULL,
	`wholesale_price` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now','localtime')),
	`updated_at` text DEFAULT (datetime('now','localtime')),
	FOREIGN KEY (`current_shipment_id`) REFERENCES `shipments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`sold_at` text DEFAULT (datetime('now','localtime')) NOT NULL,
	`type` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now','localtime')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now','localtime')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` text PRIMARY KEY NOT NULL,
	`shipment_code` text,
	`shipment_date` text NOT NULL,
	`arrival_date` text,
	`expenses` text NOT NULL,
	`products_count` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now','localtime')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now','localtime')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shipments_to_products` (
	`product_id` text NOT NULL,
	`shipment_id` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`unit_price` integer DEFAULT 0 NOT NULL,
	`total_price` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`product_id`, `shipment_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shipment_id`) REFERENCES `shipments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_ref_unique` ON `products` (`ref`);--> statement-breakpoint
CREATE UNIQUE INDEX `shipments_shipment_code_unique` ON `shipments` (`shipment_code`);