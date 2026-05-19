import { Request, Response } from "express";
import { loginUser, registerUser, verifyEmail } from "../services/auth.service";


export const register = async (req:Request, res:Response) => {
    const result = await registerUser(req.body)
    res.status(201).json(result)
}

export const verify = async (req:Request, res:Response) => {
    const { token } = req.body
    const result = await verifyEmail(token)
    res.status(200).json(result)
}

export const login = async (req:Request, res:Response) => {
    const {email, password} = req.body
    const result = await loginUser(email, password)
    res.status(200).json(result)
}