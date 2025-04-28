import { z } from "zod";
import { agent } from "@/functions/atproto";
import {
    ApiResponse,
    BskyPostResponse,
    StatusTypes,
} from "@/entities/types/responses";

export async function POST(req: Request) {
    const body = await req.json();
    const validation = makePostOptsSchema.safeParse(body);
    if (validation.success) {
        const reqData = validation.data;
        await agent.login({
            identifier: reqData.identifier,
            password: reqData.appPassword,
        });
        const postAttemptResponseData: BskyPostResponse = await agent.post({
            text: reqData.textContent,
            createdAt: new Date().toISOString(),
        });
        const response: ApiResponse = {
            data: postAttemptResponseData,
            status: StatusTypes.SUCCESS,
        };
        return new Response(JSON.stringify(response), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "text/plain",
            },
        });
    } else {
        const response: ApiResponse = {
            status: StatusTypes.ERROR,
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

export const makePostOptsSchema = z.object({
    identifier: z.string(),
    appPassword: z.string(),
    textContent: z.string().max(300),
});

export type MakePostOpts = z.infer<typeof makePostOptsSchema>;
