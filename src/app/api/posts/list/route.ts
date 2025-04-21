import db from "@/db";
import { postsSelectSchemaArray } from "@/db/schema/scheduled_posts";

export async function GET() {
    const posts = await db.query.scheduledPosts.findMany();
    const validation = postsSelectSchemaArray.safeParse(posts);
    if (validation.success) {
        return new Response(JSON.stringify(validation.data), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        return new Response(
            `Something went wrong on our side. Please try again later. Details: ${validation.error}`,
            {
                status: 500,
                statusText: "Internal Server Error",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}
