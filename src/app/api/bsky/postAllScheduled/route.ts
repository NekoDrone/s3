import {
    ApiResponse,
    BskyPostResponse,
    StatusType,
} from "@/entities/types/responses";
import { ErrorType } from "@/entities/types/errors";
import db from "@/db";
import { and, eq, lte } from "drizzle-orm";
import {
    postsSelectSchema,
    postsSelectSchemaArray,
    scheduledPosts,
} from "@/db/schema/scheduled_posts";
import { accounts, accountsSelectSchema } from "@/db/schema/accounts";
import { z } from "zod";
import { agent } from "@/functions/atproto";
import { decryptString } from "@/functions/enc";

export async function GET(req: Request) {
    const accessToken = process.env.CRON_TOKEN ?? "";
    if (accessToken == "") {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "You did not set the encryption key. Please check your .env file or deployment configs.",
                type: ErrorType.ENV_UNSET,
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

    const params = new URL(req.url).searchParams;
    const providedToken = params.get("token");

    if (!providedToken) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Invalid data. Please ensure that you provide the correct type.",
                details: "token must be provided in the query params",
                type: ErrorType.PARAMS_ERROR,
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

    if (providedToken != accessToken) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message: "Provided token was wrong.",
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

    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    const posts = await db
        .select()
        .from(scheduledPosts)
        .where(lte(scheduledPosts.postOn, now))
        .leftJoin(accounts, eq(scheduledPosts.account, accounts.id));
    const { success, data, error } = joinSchemaArray.safeParse(posts);

    if (!success) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Something went wrong on our side. Please try again later.",
                details: error,
                type: ErrorType.TYPE_ERROR,
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

    const secret = process.env.ATP_AP_ENC_KEY ?? "";
    if (secret == "") {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "You did not set the encryption key. Please check your .env file or deployment configs.",
                type: ErrorType.ENV_UNSET,
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

    if (data) {
        for (const entry of data) {
            const account = entry.accounts;
            const post = entry.scheduled_posts;
            const { identifier, appPasswordEncrypted, appPasswordInitVec } =
                account;
            const { postContent, id } = post;
            const appPassword = decryptString(
                appPasswordEncrypted,
                appPasswordInitVec,
                secret,
            );
            await agent.login({ identifier, password: appPassword });

            const postAttemptRes: BskyPostResponse = await agent.post({
                text: postContent,
                createdAt: new Date().toISOString(),
            });

            await agent.logout();

            if (postAttemptRes) {
                try {
                    await db
                        .delete(scheduledPosts)
                        .where(eq(scheduledPosts.id, id));
                } catch (err) {
                    const response: ApiResponse = {
                        status: StatusType.ERROR,
                        error: {
                            message:
                                "Invalid DB transaction. Constraint mismatch? Usually means a foreign key doesn't exist. Check the inputs.",
                            details: err,
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
            }
        }
    }

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
}

const joinSchema = z.object({
    scheduled_posts: postsSelectSchema,
    accounts: accountsSelectSchema,
});

const joinSchemaArray = z.array(joinSchema);
