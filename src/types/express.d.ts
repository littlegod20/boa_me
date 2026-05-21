import { AuthUser, Role } from "./user.types";

declare global {
    namespace Express {
    interface User{
        id:string
        role: Role
        email?:string
        name?:string
    }
    interface Request{
        user: AuthUser
    }
}
}
export {}