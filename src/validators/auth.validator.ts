import {z} from 'zod'
import { Role } from '../types/user.types'

export const registerAuthSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email(),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    role: z.enum(Object.values(Role) as [string, ...string[]])
})


export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1, 'Password is required')
})


export const verifyEmailSchema = z.object({
    token: z.string()
})

export const forgotPasswordSchema = z.object({
    email: z.email()
})

export const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
})

