import db from "@/db";
import { postsInsertSchema, scheduledPosts } from "@/db/schema/scheduled_posts";
import { ApiResponse, StatusType } from "@/entities/types/responses";

export async function POST(request: Request) {
    const body = await request.json();
    const validation = postsInsertSchema.safeParse(body);
    if (validation.success) {
        await db.insert(scheduledPosts).values(validation.data);
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
