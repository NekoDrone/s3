export interface ApiResponse {
    data: InnerResponse;
    status: StatusTypes;
}

export enum StatusTypes {
    SUCCESS = 'success',
    ERROR = 'error',
}

type InnerResponse = LoginResponse | PostsResponse

export interface LoginResponse {
    appPasswordEncrypted: string,
    appPasswordInitVec: string,
}

export interface PostsResponse {
    
}