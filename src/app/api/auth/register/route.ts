import { AccountInsert, accounts } from "@/db/schema/accounts";
import db from "@/db";
import { ApiResponse, StatusType } from "@/entities/types/responses";
import { z } from "zod";
import { encryptString } from "@/functions/enc";
import { hashString } from "@/functions/hash";
import { ErrorType } from "@/entities/types/errors";
import { agent } from "@/functions/atproto";

export async function POST(req: Request) {
    const body = await req.json();
    const { success, data, error } = registerOptsSchema.safeParse(body);

    if (!success) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Invalid data. Please ensure that you provide the correct type.",
                details: error,
                type: ErrorType.TYPE_ERROR,
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
    const { identifier, appPassword, password } = data;

    let did;

    try {
        did = (await agent.resolveHandle({ handle: identifier })).data.did;
    } catch (err) {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "Could not resolve DID from handle. Are you sure the account exists?",
                details: err,
                type: RegisterErrorType.INVALID_HANDLE,
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
    await agent.login({
        identifier,
        password: appPassword,
    });
    const avatarUri = (await agent.getProfile({ actor: did })).data.avatar;
    await agent.logout();

    const secret = process.env.ATP_AP_ENC_KEY ?? "";
    if (secret == "") {
        const response: ApiResponse = {
            status: StatusType.ERROR,
            error: {
                message:
                    "You did not set the encryption key. Please check your .env file or deployment configs.",
                type: ErrorType.ENV_UNSET,
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

    const { encrypted: appPasswordEncrypted, initVecHex: appPasswordInitVec } =
        encryptString(appPassword, secret);

    let passwordHash = "";

    if (password) passwordHash = hashString(password);

    const insertionData: AccountInsert = {
        identifier,
        appPasswordEncrypted,
        appPasswordInitVec,
        passwordHash,
        did,
        avatarUri,
    };

    await db.insert(accounts).values(insertionData);
    const response: ApiResponse = {
        data: insertionData,
        status: StatusType.SUCCESS,
    };
    return new Response(JSON.stringify(response), {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export const registerOptsSchema = z.object({
    identifier: z.string(),
    appPassword: z.string(),
    password: z.string().optional(),
});

export type RegisterOpts = z.infer<typeof registerOptsSchema>;

export enum RegisterErrorType {
    INVALID_HANDLE = "Invalid handle.",
    USER_DOES_NOT_EXIST = "User does not exist.",
}
