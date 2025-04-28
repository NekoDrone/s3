import { accounts, accountsInsertSchema } from "@/db/schema/accounts";
import db from "@/db";
import { ApiResponse, StatusType } from "@/entities/types/responses";

export async function POST(req: Request) {
    const body = await req.json();
    const validation = accountsInsertSchema.safeParse(body);
    if (validation.success) {
        await db.insert(accounts).values(validation.data);
        const response: ApiResponse = {
            status: StatusType.SUCCESS,
        };
        return new Response(JSON.stringify(response), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Invalid data. Please ensure that you provide the correct type.",
                details: validation.error,
            },
        };
        return new Response(JSON.stringify(response), {
            status: 400,
            statusText: "Bad Request",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
