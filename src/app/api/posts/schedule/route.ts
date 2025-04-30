import db from "@/db";
import {
    ScheduledPostInsert,
    scheduledPosts,
} from "@/db/schema/scheduled_posts";
import { ApiResponse, StatusType } from "@/entities/types/responses";
import { z } from "zod";
import { ErrorType } from "@/entities/types/errors";
import { accounts } from "@/db/schema/accounts";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    const body = await request.json();
    const { success, data, error } = schedulePostOptsSchema.safeParse(body);
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

    const { identifier, postOn, postContent } = data;

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

    const insertionData: ScheduledPostInsert = {
        account: account.id,
        postOn,
        postContent,
    };

    try {
        await db.insert(scheduledPosts).values(insertionData);
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
            status: 400,
            statusText: "Bad Request",
            headers: {
                "Content-Type": "application/json",
            },
        });
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

const schedulePostOptsSchema = z.object({
    identifier: z.string(),
    postOn: z.coerce.date(),
    postContent: z.string(),
});

export type SchedulePostOpts = z.infer<typeof schedulePostOptsSchema>;
