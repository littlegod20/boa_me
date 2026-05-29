import {config} from 'dotenv'
import { logger } from './config/logger.config'
import { createApp } from "./app"
import { connectDB } from './config/database.config'
import { initializePassport } from './config/passport.config'
import { connectRabbitMQ } from './config/rabbitmq.config'
import { startPayoutWorker } from './workers/payout.worker'
import { startPayoutCronJob } from './jobs/payout.job'
import { createServer } from 'http'
import { initializeSocket } from './config/socket.config'
import { connectRedis } from './config/redis.config'

config()
initializePassport()

const startServer = async () => {
    const port = process.env.PORT || 3000
    const app = createApp()

    // create HTTP server from Express app
    const httpServer = createServer(app)

    // attach Socket.io to HTTP server
    initializeSocket(httpServer)

    await connectDB()
    await connectRedis()
    await connectRabbitMQ()
    await startPayoutWorker()
    startPayoutCronJob()

    httpServer.listen(port, ()=> {
        logger.info(`Port listening on ${port}`)
    })
}

startServer()