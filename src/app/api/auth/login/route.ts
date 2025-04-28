import { z } from "zod";
import db from "@/db";
import { and, eq } from "drizzle-orm";
import { accounts } from "@/db/schema/accounts";
import {
    ApiResponse,
    LoginResponse,
    StatusType,
} from "@/entities/types/responses";

export async function POST(req: Request) {
    const body = await req.json();
    const validation = loginOptsSchema.safeParse(body);
    if (validation.success) {
        const data: LoginResponse | undefined =
            await db.query.accounts.findFirst({
                where: and(
                    eq(accounts.identifier, validation.data.identifier),
                    eq(accounts.passwordHash, validation.data.passwordHash),
                ),
            });
        if (data) {
            const response: ApiResponse = {
                status: StatusType.SUCCESS,
                data,
            };
            return new Response(JSON.stringify(response), {
                status: 401,
                statusText: "Unauthorized",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } else {
            const response: ApiResponse = {
                status: StatusType.ERROR,
                error: {
                    message:
                        "Could not find provided username and password hash in database.",
                },
            };
            return new Response(JSON.stringify(response), {
                status: 401,
                statusText: "Unauthorized",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
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

export const loginOptsSchema = z.object({
    identifier: z.string(),
    passwordHash: z.string(),
});

export type LoginOpts = z.infer<typeof loginOptsSchema>;
