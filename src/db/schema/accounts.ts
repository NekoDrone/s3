import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const accounts = sqliteTable(
    "accounts",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        identifier: text("identifier").notNull(),
        appPasswordEncrypted: text("app_password_enc").notNull(),
        appPasswordInitVec: text("app_password_init_vec").notNull(),
        passwordHash: text("password_hash"),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch('now'))`),
        did: text("did").notNull(),
        avatarUri: text("avatar_uri"),
    },
    (table) => {
        return [index("idx_accounts_identifier").on(table.identifier)];
    },
);

export const accountsSelectSchema = createSelectSchema(accounts);
export const accountsInsertSchema = createInsertSchema(accounts);

export type Account = z.infer<typeof accountsInsertSchema>;
