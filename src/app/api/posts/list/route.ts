import db from "@/db";
import {
    postsSelectSchemaArray,
    scheduledPosts,
} from "@/db/schema/scheduled_posts";
import {
    ApiResponse,
    PostsResponse,
    StatusType,
} from "@/entities/types/responses";
import { ErrorType } from "@/entities/types/errors";
import { accounts } from "@/db/schema/accounts";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    const params = new URL(req.url).searchParams;
    const identifier = params.get("identifier");

    if (!identifier) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Invalid data. Please ensure that you provide the correct type.",
                details: "identifier must be provided in the query params",
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

    const account = (
        await db
            .select({
                id: accounts.id,
                identifier: accounts.identifier,
            })
            .from(accounts)
            .where(eq(accounts.identifier, identifier))
            .limit(1)
    )[0];

    console.log(account);

    const posts = await db.query.scheduledPosts.findMany({
        where: eq(scheduledPosts.account, account.id),
    });
    const { success, data, error } = postsSelectSchemaArray.safeParse(posts);

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

    const response: ApiResponse = {
        data,
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
