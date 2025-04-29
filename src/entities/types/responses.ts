import { ApiError } from "@/entities/types/errors";
import { postsSelectSchemaArray } from "@/db/schema/scheduled_posts";
import { z } from "zod";
import { accountsSelectSchema } from "@/db/schema/accounts";

export interface ApiResponse {
    data?: ResponseData;
    status: StatusType;
    error?: ApiError;
}

export enum StatusType {
    SUCCESS = "success",
    ERROR = "error",
}

type ResponseData = LoginResponse | PostsResponse | BskyPostResponse;

export type LoginResponse = {
    identifier: string;
    appPassword: string;
};

export type PostsResponse = z.infer<typeof postsSelectSchemaArray>;

export interface BskyPostResponse {
    uri: string;
    cid: string;
}
