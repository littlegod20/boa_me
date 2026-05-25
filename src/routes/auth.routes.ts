import { Router } from 'express'
import { googleAuthCallback, login, passwordReset, register, userForgotPassword, verify } from '../controllers/auth.controller'
import passport from 'passport'
import { forgotPasswordSchema, loginSchema, registerAuthSchema, resetPasswordSchema, verifyEmailSchema } from '../validators/auth.validator'
import { validate } from '../middlewares/validate.middleware'

const router = Router()

router.post('/register',validate(registerAuthSchema), register)
router.patch('/verify-email',validate(verifyEmailSchema), verify)
router.post('/login',validate(loginSchema), login)

// redirects user to Google consent screen
router.get('/google', passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
}))

// Google redirects here after authentication
router.get('/google/callback', passport.authenticate('google', {
    session: false
}), googleAuthCallback)

router.post('/forgot-password', validate(forgotPasswordSchema), userForgotPassword)
router.post('/password-reset', validate(resetPasswordSchema), passwordReset)

export default router