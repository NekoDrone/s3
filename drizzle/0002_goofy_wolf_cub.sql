ALTER TABLE `accounts` ADD `password_enc` text NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` ADD `password_init_vec` text NOT NULL;