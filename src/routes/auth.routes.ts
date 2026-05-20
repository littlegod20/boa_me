import { Router } from 'express'
import { googleAuthCallback, login, passwordReset, register, userForgotPassword, verify } from '../controllers/auth.controller'
import passport from 'passport'

const router = Router()

router.post('/register', register)
router.patch('/verify-email', verify)
router.post('/login', login)

// redirects user to Google consent screen
router.get('/google', passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
}))

// Google redirects here after authentication
router.get('/google/callback', passport.authenticate('google', {
    session: false
}), googleAuthCallback)

router.post('/forgot-password', userForgotPassword)
router.post('/password-reset', passwordReset)

export default router