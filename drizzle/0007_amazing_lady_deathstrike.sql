PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_scheduled_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_content` text NOT NULL,
	`account` integer NOT NULL,
	`post_on` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`account`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_scheduled_posts`("id", "post_content", "account", "post_on", "status", "created_at") SELECT "id", "post_content", "account", "post_on", "status", "created_at" FROM `scheduled_posts`;--> statement-breakpoint
DROP TABLE `scheduled_posts`;--> statement-breakpoint
ALTER TABLE `__new_scheduled_posts` RENAME TO `scheduled_posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_scheduled_posts_post_on` ON `scheduled_posts` (`post_on`);--> statement-breakpoint
CREATE INDEX `idx_scheduled_posts_status` ON `scheduled_posts` (`status`);