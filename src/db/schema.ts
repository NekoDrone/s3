// quite annoying, can probably automate this in the future
// any new schema definitions must be imported here before used in the rest of the app.

import { scheduledPosts } from "@/db/schema/scheduled_posts";
import { accounts } from "@/db/schema/accounts";

export const schema = {
    scheduledPosts,
    accounts,
};

export * from "@/db/schema/scheduled_posts";
