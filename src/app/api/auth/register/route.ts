import { accounts, accountsInsertSchema } from "@/db/schema/accounts";
import db from "@/db";

export async function POST(req: Request) {
    const body = await req.json();
    const validation = accountsInsertSchema.safeParse(body);
    if (validation.success) {
        await db.insert(accounts).values(validation.data);
        return new Response(null, { status: 200, statusText: "OK" });
    } else {
        return new Response(
            `Invalid data. Please ensure that you provide the correct type. Details: ${validation.error}`,
            {
                status: 400,
                statusText: "Bad Request",
                headers: {
                    "Content-Type": "text/plain",
                },
            },
        );
    }
}
