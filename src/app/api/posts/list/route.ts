import db from "@/db";
import { postsSelectSchemaArray } from "@/db/schema/scheduled_posts";
import {
    ApiResponse,
    PostsResponse,
    StatusType,
} from "@/entities/types/responses";

export async function GET() {
    const posts = await db.query.scheduledPosts.findMany();
    const validation = postsSelectSchemaArray.safeParse(posts);
    if (validation.success) {
        const data = validation.data as PostsResponse;
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
    } else {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Something went wrong on our side. Please try again later.",
                details: validation.error,
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
