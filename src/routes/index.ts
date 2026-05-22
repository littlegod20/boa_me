import { Router } from 'express'
import authRouter from './auth.routes'
import categoryRouter from './category.routes'
import serviceRouter from './service.routes'
import providerServiceRouter from './provider.routes'
import bookingRouter from './booking.routes'


const router = Router()
router.use('/auth', authRouter)
router.use('/categories', categoryRouter)
router.use('/services', serviceRouter)
router.use('/providers', providerServiceRouter)
router.use('/bookings', bookingRouter)

export default router