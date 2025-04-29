export interface ApiError {
    type?: string;
    message: string;
    details?: unknown;
}

export enum ErrorType {
    TYPE_ERROR = "Type error.",
    ENV_UNSET = "An environment variable was not properly set.",
}
