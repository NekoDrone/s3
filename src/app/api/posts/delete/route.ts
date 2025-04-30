import { z } from "zod";
import { ApiResponse, StatusType } from "@/entities/types/responses";
import { ErrorType } from "@/entities/types/errors";
import db from "@/db";
import { scheduledPosts } from "@/db/schema/scheduled_posts";
import { and, eq } from "drizzle-orm";

export async function DELETE(req: Request) {
    const body = await req.json();
    const { success, data, error } = deletePostOptsSchema.safeParse(body);
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

    const { id, account } = data;

    try {
        await db
            .delete(scheduledPosts)
            .where(
                and(
                    eq(scheduledPosts.id, id),
                    eq(scheduledPosts.account, account),
                ),
            );
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

export const deletePostOptsSchema = z.object({
    id: z.number(),
    account: z.number(),
});

export type DeletePostOpts = z.infer<typeof deletePostOptsSchema>;
