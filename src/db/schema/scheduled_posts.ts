import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { accounts } from "@/db/schema/accounts";

export const scheduledPosts = sqliteTable(
    "scheduled_posts",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        postContent: text("post_content").notNull(),
        account: integer("account")
            .notNull()
            .references(() => accounts.id),
        postOn: integer("post_on", { mode: "timestamp" }).notNull(),
        status: text("status").notNull().default("pending"),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch('now'))`),
    },
    (table) => {
        return [
            index("idx_scheduled_posts_post_on").on(table.postOn),
            index("idx_scheduled_posts_status").on(table.status),
        ];
    },
);

export const postsSelectSchema = createSelectSchema(scheduledPosts);
export const postsSelectSchemaArray = z.array(postsSelectSchema);
export const postsInsertSchema = createInsertSchema(scheduledPosts, {
    postOn: z.coerce.date(),
});

export type ScheduledPostInsert = z.infer<typeof postsInsertSchema>;
