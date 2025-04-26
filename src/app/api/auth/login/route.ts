import { z } from "zod";
import db from "@/db";
import { and, eq } from "drizzle-orm";
import { accounts } from "@/db/schema/accounts";

export async function POST(req: Request) {
    const body = await req.json();
    const validation = loginOptsSchema.safeParse(body);
    if (validation.success) {
        const appPassword = await db.query.accounts.findFirst({
            where: and(
                eq(accounts.identifier, validation.data.identifier),
                eq(accounts.passwordHash, validation.data.passwordHash),
            ),
            columns: {
                appPasswordEncrypted: true,
                appPasswordInitVec: true,
            },
        });
        return;
    }
}

export const loginOptsSchema = z.object({
    identifier: z.string(),
    passwordHash: z.string(),
});

export type LoginOpts = z.infer<typeof loginOptsSchema>;
