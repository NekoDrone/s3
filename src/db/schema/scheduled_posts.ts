import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const scheduledPosts = sqliteTable(
    "scheduled_posts",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        postContent: text("post_content").notNull(),
        account: text("account").notNull(),
        postOn: integer("post_on", { mode: "timestamp" }).notNull(),
        status: text("status").notNull().default("pending"),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(CURRENT_TIMESTAMP)`),
    },
    (table) => {
        return [
            index("idx_scheduled_posts_post_on").on(table.postOn),
            index("idx_scheduled_posts_status").on(table.status),
        ];
    },
);
