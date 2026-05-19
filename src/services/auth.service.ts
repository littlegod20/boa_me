import bcrypt from 'bcrypt'
import { RegisterInput } from '../types/user.types'
import { generateVerificationToken } from '../utils/token.utils'
import { createUser, findUserByEmail, findUserByVerificationToken, verifyUserEmail } from './user.service'
import { AppError } from '../middlewares/errorHandler'
import { generateToken } from '../utils/jwt.utils'


export const registerUser = async (user:RegisterInput)=>{
    
    try {
        // check if email exists
        const existingEmail = await findUserByEmail(user.email)
        if (existingEmail){
            throw new AppError('Email already in use.', 409)
        }
        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(user.password, salt)

        // generate email verification token
        const email_token = generateVerificationToken()

        await createUser({
            ...user,
            password: hashed_password,
            email_verification_token: email_token.token,
            email_verification_token_expires_at: email_token.expiry
        })

        // send verification email
        console.log('sending email verification link to user')

        return {success:true, message:'User created successfully'}
    } catch (error) {
        throw error
    }
}

export const verifyEmail = async (token:string) => {

    try {
        const user = await findUserByVerificationToken(token)
    
        if (!user){
            throw new AppError('User not found!', 404)
        }

        // check if token has expired
        if (!user.email_verification_token_expires_at) {
            throw new AppError('Invalid verification token.', 400)
        }

        const is_token_expired = user.email_verification_token_expires_at < new Date()

        if(is_token_expired){
            throw new AppError('Verification token has expired.', 400)
        }
    
        await verifyUserEmail(user.id)

        return {success:true, message:'Email verified successfully'}
        
    } catch (error) {
        throw error
    }
}

export const loginUser = async (email:string, user_password:string) => {
    try {
        const existingUser = await findUserByEmail(email)

        if (!existingUser){
            throw new AppError('Invalid email or password', 401)
        }

        if (!existingUser.email_verified_at){
            throw new AppError('Please verify your email before login.', 404)
        }

        const passwordMatch = await bcrypt.compare(user_password, existingUser.password as string)

        if (!passwordMatch){
            throw new AppError('Invalid email or password!', 401)
        }

        const payload={
            id: existingUser.id,
            role: existingUser.role,
            email: existingUser.email,
            name: existingUser.name
        }
        
        // sign token
        const token = generateToken(payload)

        const { password, email_verification_token, forgot_password_token, ...safeUser } = existingUser

        return {
            success: true,
            message: "User logged in successfully!",
            user:safeUser,
            token
        }
        
    } catch (error) {
        throw error
    }

}