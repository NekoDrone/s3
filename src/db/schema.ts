// quite annoying, can probably automate this in the future
// any new schema definitions must be imported here before used in the rest of the app.

import { scheduledPosts } from "@/db/schema/scheduled_posts";

export const schema = {
    scheduledPosts,
};

export * from "@/db/schema/scheduled_posts";
