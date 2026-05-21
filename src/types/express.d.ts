import { AuthUser, Role } from "./user.types";

declare global {
    namespace Express {
    interface User{
        role: Role
    }
    interface Request{
        user: AuthUser
    }
}
}
export {}