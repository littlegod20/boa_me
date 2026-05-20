import { Router } from 'express'
import { login, passwordReset, register, userForgotPassword, verify } from '../controllers/auth.controller'

const router = Router()

router.post('/register', register)
router.patch('/verify-email', verify)
router.post('/login', login)

router.post('/forgot-password', userForgotPassword)
router.post('/password-reset', passwordReset)

export default router