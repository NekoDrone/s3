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
    if (!validation.success) {
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
    const user = (
        await db
            .select({
                identifier: accounts.identifier,
                passwordHash: accounts.passwordHash,
            })
            .from(accounts)
            .where(eq(accounts.identifier, validation.data.identifier))
            .limit(1)
    )[0];

    if (!user) {
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

    const storedPassword = user.passwordHash;
    const inputPassword = validation.data.passwordHash;
    const isCorrectPassword = storedPassword == inputPassword;
    if (!isCorrectPassword) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message: "User exists. Incorrect password.",
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

    const data: LoginResponse | undefined = await db.query.accounts.findFirst({
        where: eq(accounts.identifier, validation.data.identifier),
    });
    if (!data) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Can login, but cannot find account? This shouldn't happen.",
            },
        };
        return new Response(JSON.stringify(response), {
            status: 500,
            statusText: "Internal Server Error",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const response: ApiResponse = {
        status: StatusType.SUCCESS,
        data,
    };

    return new Response(JSON.stringify(response), {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export const loginOptsSchema = z.object({
    identifier: z.string(),
    passwordHash: z.string(),
});

export type LoginOpts = z.infer<typeof loginOptsSchema>;
