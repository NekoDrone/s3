import { ApiError } from "@/entities/types/errors";
import { postsSelectSchemaArray } from "@/db/schema/scheduled_posts";
import { z } from "zod";

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

export interface LoginResponse {
    appPasswordEncrypted: string;
    appPasswordInitVec: string;
}

export type PostsResponse = z.infer<typeof postsSelectSchemaArray>;

export interface BskyPostResponse {
    uri: string;
    cid: string;
}
