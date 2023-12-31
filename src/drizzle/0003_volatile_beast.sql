CREATE TABLE `users` (
	`id` text,
	`username` text PRIMARY KEY NOT NULL,
	`password` text NOT NULL,
	`created_at` text DEFAULT (datetime('now','localtime')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now','localtime')) NOT NULL
);
