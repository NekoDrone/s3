CREATE TABLE `scheduled_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_content` text NOT NULL,
	`account` text NOT NULL,
	`post_on` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_scheduled_posts_post_on` ON `scheduled_posts` (`post_on`);--> statement-breakpoint
CREATE INDEX `idx_scheduled_posts_status` ON `scheduled_posts` (`status`);