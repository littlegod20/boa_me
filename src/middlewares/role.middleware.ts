import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";
import { Role } from "../types/user.types";


export const isAdmin = (req:Request, res:Response, next:NextFunction) => {
    const user = req.user

    if(!user){
        throw new AppError('User not found', 401)
    }

    const role = user.role
    // check if user is an admin
    if (role !== Role.ADMIN){
        throw new AppError('Unauthorized', 401)
    }

    next()
}