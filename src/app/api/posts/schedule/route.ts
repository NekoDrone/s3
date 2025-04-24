import db from "@/db";
import { postsInsertSchema, scheduledPosts } from "@/db/schema/scheduled_posts";

export async function POST(request: Request) {
    const body = await request.json();
    const validation = postsInsertSchema.safeParse(body);
    if (validation.success) {
        await db.insert(scheduledPosts).values(validation.data);
        return new Response(null, { status: 200, statusText: "OK" });
    } else {
        return new Response(
            `Invalid data. Please ensure that you provide the correct type. Details: ${validation.error}`,
            {
                status: 400,
                statusText: "Bad Request",
                headers: {
                    "Content-Type": "text/plain",
                },
            },
        );
    }
}
