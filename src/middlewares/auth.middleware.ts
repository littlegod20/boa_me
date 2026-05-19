import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { AppError } from "./errorHandler";


export const authenticate = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization

    if(!token || !token.startsWith('Bearer ')){
        throw new AppError('Invalid token', 401)
    }

    const parsed_token = token.split(' ')[1]

    // verify token
    const payload = verifyToken(parsed_token)

    req.user = payload

    next()
}