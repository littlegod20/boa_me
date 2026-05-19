import bcrypt from 'bcrypt'
import { RegisterInput, User } from '../types/user.types'
import { generateVerificationToken } from '../utils/token.utils'
import { createUser, findUserByEmail } from './user.service'
import { AppError } from '../middlewares/errorHandler'


export const registerUser = async (user:RegisterInput)=>{
    // check if email exists
    const existingEmail = await findUserByEmail(user.email)
    if (existingEmail){
        throw new AppError('Email already in use.', 409)
    }

    try {
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