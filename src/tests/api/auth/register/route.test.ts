import { describe, expect, test } from "vitest";
import { POST } from "@/app/api/auth/register/route";

describe("Register route should return", () => {
    test("validation error if given incorrect type", async () => {
        const req: Request = new Request("http://localhost:3000", {
            method: "POST",
            body: JSON.stringify({
                identifier: null,
                appPasswordEncrypted: 1,
                appPasswordInitVec: "hehe",
                passwordHash: new Date(),
            }),
        });

        const res = new Response(
            JSON.stringify({
                status: "error",
                error: {
                    message:
                        "Invalid data. Please ensure that you provide the correct type.",
                    details: {
                        issues: [
                            {
                                code: "invalid_type",
                                expected: "string",
                                received: "null",
                                path: ["identifier"],
                                message: "Expected string, received null",
                            },
                            {
                                code: "invalid_type",
                                expected: "string",
                                received: "number",
                                path: ["appPasswordEncrypted"],
                                message: "Expected string, received number",
                            },
                        ],
                        name: "ZodError",
                    },
                },
            }),
            {
                status: 400,
                statusText: "Bad Request",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        expect(JSON.stringify(await POST(req))).toEqual(JSON.stringify(res));
    });
});
