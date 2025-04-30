import { z } from "zod";

export const loginOptsSchema = z.object({
    identifier: z.string(),
    password: z.string(),
});

export type LoginOpts = z.infer<typeof loginOptsSchema>;

export enum LoginErrorType {
    USER_DOES_NOT_EXIST = "User does not exist.",
    USER_NO_STORED_PASS = "User does not have a stored password.",
    INCORRECT_PASSWORD = "Provided password is incorrect.",
    SHOULD_NOT_HAPPEN = "This should not have happened.",
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

export const makePostOptsSchema = z.object({
    identifier: z.string(),
    appPassword: z.string(),
    textContent: z.string().max(300),
});

export type MakePostOpts = z.infer<typeof makePostOptsSchema>;

export const deletePostOptsSchema = z.object({
    id: z.number(),
    account: z.number(),
});

export type DeletePostOpts = z.infer<typeof deletePostOptsSchema>;

export const schedulePostOptsSchema = z.object({
    identifier: z.string(),
    postOn: z.coerce.date(),
    postContent: z.string(),
});

export type SchedulePostOpts = z.infer<typeof schedulePostOptsSchema>;
