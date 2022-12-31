export type RegisterResponse = {
    code: number;
    errors: any;
    user: any;
}

export type LoginResponse = {
    success: boolean;
    user?: any;
}