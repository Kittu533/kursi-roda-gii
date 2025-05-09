// ~/types/auth/index.ts

export interface LoginPayload {
    username: string
    password: string
}

export interface LoginResponse {
    response: {
        full_name: string
        username: string
        key: string
        token: string
    },
    metaData: {
        message: string
        code: number
        response_code: string
    }
}
