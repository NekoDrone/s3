DROP INDEX "idx_accounts_identifier";--> statement-breakpoint
DROP INDEX "idx_scheduled_posts_post_on";--> statement-breakpoint
DROP INDEX "idx_scheduled_posts_status";--> statement-breakpoint
ALTER TABLE `accounts` ALTER COLUMN "password_hash" TO "password_hash" text;--> statement-breakpoint
CREATE INDEX `idx_accounts_identifier` ON `accounts` (`identifier`);--> statement-breakpoint
CREATE INDEX `idx_scheduled_posts_post_on` ON `scheduled_posts` (`post_on`);--> statement-breakpoint
CREATE INDEX `idx_scheduled_posts_status` ON `scheduled_posts` (`status`);