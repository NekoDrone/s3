import { describe, expect, test } from "vitest";
import { POST } from "@/app/api/auth/login/route";

describe("Login route should return", () => {
    test("validation error if given incorrect type", async () => {
        const req: Request = new Request("http://localhost:3000", {
            method: "POST",
            body: JSON.stringify({
                identifier: null,
                passwordHash: 1,
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
                                path: ["passwordHash"],
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

    test("cannot be found error", async () => {
        const req: Request = new Request("http://localhost:3000", {
            method: "POST",
            body: JSON.stringify({
                identifier: "thisuserdoesnotexist.invalid.domainnamespace",
                passwordHash: "wrongPassword!!2353q4563sduifa",
            }),
        });

        const res = new Response(
            JSON.stringify({
                status: "error",
                error: {
                    message:
                        "Could not find provided username and password hash in database.",
                },
            }),
            {
                status: 401,
                statusText: "Unauthorized",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        expect(JSON.stringify(await POST(req))).toEqual(JSON.stringify(res));
    });

    test("incorrect password error", async () => {
        const req: Request = new Request("http://localhost:3000", {
            method: "POST",
            body: JSON.stringify({
                identifier: "testunencrypted.bsky.social",
                passwordHash: "wrongPassword!!2353q4563sduifa",
            }),
        });

        const res = new Response(
            JSON.stringify({
                status: "error",
                error: {
                    message: "User exists. Incorrect password.",
                },
            }),
            {
                status: 401,
                statusText: "Unauthorized",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        expect(JSON.stringify(await POST(req))).toEqual(JSON.stringify(res));
    });

    test("correct login values when found", async () => {
        const req: Request = new Request("http://localhost:3000", {
            method: "POST",
            body: JSON.stringify({
                identifier: "testunencrypted.bsky.social",
                passwordHash: "unencryptedHash",
            }),
        });

        const res = new Response(
            JSON.stringify({
                status: "success",
                data: {
                    id: 2,
                    identifier: "testunencrypted.bsky.social",
                    appPasswordEncrypted: "testUnencrypted",
                    appPasswordInitVec: "none",
                    passwordHash: "unencryptedHash",
                    createdAt: "2025-04-28T07:34:16.000Z",
                },
            }),
            {
                status: 200,
                statusText: "OK",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        expect(JSON.stringify(await POST(req))).toEqual(JSON.stringify(res));
    });
});
