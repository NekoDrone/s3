import { agent } from "@/functions/atproto";
import {
    ApiResponse,
    BskyPostResponse,
    StatusType,
} from "@/entities/types/responses";
import { makePostOptsSchema } from "@/entities/types/api";

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
            status: StatusType.SUCCESS,
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
