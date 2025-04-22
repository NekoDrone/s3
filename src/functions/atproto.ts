import { AtpAgent } from "@atproto/api";

const agent = new AtpAgent({
    service: "https://bsky.social",
});

export default agent;
