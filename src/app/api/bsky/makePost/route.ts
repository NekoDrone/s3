import { z } from "zod";
import { agent } from "@/functions/atproto";

export async function POST(req: Request) {
    const body = await req.json();
    const validation = makePostOptsSchema.safeParse(body);
    if (validation.success) {
        const reqData = validation.data;
        await agent.login({
            identifier: reqData.identifier,
            password: reqData.appPassword,
        });
        const res = await agent.post({
            text: reqData.textContent,
            createdAt: new Date().toISOString(),
        });
        return new Response(`New post URI: ${res.uri}`, {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "text/plain",
            },
        });
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

export const makePostOptsSchema = z.object({
    identifier: z.string(),
    appPassword: z.string(),
    textContent: z.string().max(300),
});

export type MakePostOpts = z.infer<typeof makePostOptsSchema>;
