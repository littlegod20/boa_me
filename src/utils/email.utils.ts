import { Resend } from "resend"
import { AppError } from "../middlewares/errorHandler"

export const sendEmail = async (email:string, content:{subject:string, html:string}) => {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const {data, error} = await resend.emails.send({
        from: "Boame <boame@resend.dev>",
        to: [email],
        subject: content.subject,
        html: content.html
    })

    if (error) {
        throw new AppError('Failed to send email', 500)
    }

    return data
}

export const sendPasswordResetEmail = async (email:string, token:string)=> {
    await sendEmail(email, {
        subject: 'Password Reset',
        html: `
            <p>You requested a password reset for your Boame account.</p>
            <a href="https://boame.app/reset-password?token=${token}">Reset your password</a>
            <p>This link expires in 24 hours.</p>
            <p>If you didn't request this, ignore this email.</p>
        `
    })
}

export const sendEmailVerificationToken = async (token:string, email:string)=>{
    await sendEmail(email, {
        subject: 'Email Verification',
        html: `
            <p>This is to verify that this email belongs to you.</p>
            <a href="https://boame.app/verify-email?token=${token}">Verify your email</a>
            <p>This link expires in 24 hours.</p>
            <p>If you didn't request this, ignore this email.</p>
        `
    })
}