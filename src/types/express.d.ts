import { User } from "./user.types";

declare namespace Express {
    interface Request{
        user: User
    }
}