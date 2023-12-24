CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ref` text,
	`company` text,
	`category` text,
	`stock` integer DEFAULT 0 NOT NULL,
	`retail_price` integer DEFAULT 0 NOT NULL,
	`wholesale_price` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` text PRIMARY KEY NOT NULL,
	`shipment_code` text,
	`shipment_date` text NOT NULL,
	`arrival_date` text,
	`expenses` text NOT NULL,
	`products_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shipments_to_products` (
	`product_id` text NOT NULL,
	`shipment_id` text NOT NULL,
	PRIMARY KEY(`product_id`, `shipment_id`),
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shipment_id`) REFERENCES `shipments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_ref_unique` ON `products` (`ref`);--> statement-breakpoint
CREATE UNIQUE INDEX `shipments_shipment_code_unique` ON `shipments` (`shipment_code`);