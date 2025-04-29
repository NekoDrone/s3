import { Account, accounts } from "@/db/schema/accounts";
import db from "@/db";
import { ApiResponse, StatusType } from "@/entities/types/responses";
import { z } from "zod";
import { encryptString } from "@/functions/enc";
import { hashString } from "@/functions/hash";

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

    const secret = process.env.ATP_AP_ENC_KEY ?? "";
    if (secret == "")
        throw new Error(
            "You did not set the encryption key. Please check your .env file.",
        );

    const { encrypted: appPasswordEncrypted, initVecHex: appPasswordInitVec } =
        encryptString(appPassword, secret);

    let passwordHash = "";

    if (password) passwordHash = hashString(password);

    const insertionData: Account = {
        identifier,
        appPasswordEncrypted,
        appPasswordInitVec,
        passwordHash,
    };

    await db.insert(accounts).values(insertionData);
    const response: ApiResponse = {
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
