ALTER TABLE `accounts` RENAME COLUMN "password_enc" TO "password_hash";--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `password_init_vec`;