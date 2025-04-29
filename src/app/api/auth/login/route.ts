import { z } from "zod";
import db from "@/db";
import { eq } from "drizzle-orm";
import { accounts } from "@/db/schema/accounts";
import {
    ApiResponse,
    LoginResponse,
    StatusType,
} from "@/entities/types/responses";
import { verifyHash } from "@/functions/hash";
import { ErrorType } from "@/entities/types/errors";

// Only call this endpoint when user tries to log in with password.
// If user has a cached App Password, or can remember on the login,
// should not call this endpoint.
export async function POST(req: Request) {
    const body = await req.json();
    const { success, data, error } = loginOptsSchema.safeParse(body);
    if (!success) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Invalid data. Please ensure that you provide the correct type.",
                details: error,
                type: ErrorType.TYPE_ERROR,
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

    const { identifier, password: inputPassword } = data;

    const user = (
        await db
            .select({
                identifier: accounts.identifier,
                passwordHash: accounts.passwordHash,
            })
            .from(accounts)
            .where(eq(accounts.identifier, identifier))
            .limit(1)
    )[0];

    if (!user) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Could not find provided username and password hash in database. User might not exist.",
                type: LoginErrorType.USER_DOES_NOT_EXIST,
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
    if (!storedPassword) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "User does not have a stored password. Did you call this endpoint wrongly? Only call this endpoint if user has set a password. If user is logging in with a cached App Password, do not call this endpoint.",
                type: LoginErrorType.USER_NO_STORED_PASS,
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

    const isCorrectPassword = verifyHash(inputPassword, storedPassword);
    if (!isCorrectPassword) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message: "User exists. Incorrect password.",
                type: LoginErrorType.INCORRECT_PASSWORD,
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

    const responseData: LoginResponse | undefined =
        await db.query.accounts.findFirst({
            where: eq(accounts.identifier, identifier),
        });
    if (!responseData) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Can login, but cannot find account? This shouldn't happen.",
                type: LoginErrorType.SHOULD_NOT_HAPPEN,
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
        data: responseData,
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
    password: z.string(),
});

export type LoginOpts = z.infer<typeof loginOptsSchema>;

export enum LoginErrorType {
    USER_DOES_NOT_EXIST = "User does not exist.",
    USER_NO_STORED_PASS = "User does not have a stored password.",
    INCORRECT_PASSWORD = "Provided password is incorrect.",
    SHOULD_NOT_HAPPEN = "This should not have happened.",
}
