import express from "express"
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from "./middlewares/errorHandler"
import appRoutes from './routes/index'
import passport from "passport"
import './config/passport.config'
import { generalLimiter } from "./config/rateLimit.config"



export const createApp = () => {
    const app = express()

    app.use(
        '/api/v1/payments/webhook',
        express.raw({ type: 'application/json' })
    )
    app.use(express.json())
    app.use(cors())
    app.use(helmet())

    app.use(generalLimiter)

    app.use(passport.initialize())

    app.get('/health' ,(req, res)=> {
        res.send('Ok')
    })

    app.use('/api/v1', appRoutes)
    
    app.use(errorHandler)
    return app
}
