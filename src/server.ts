import {config} from 'dotenv'
import { createApp } from "./app"
import { connectDB } from './config/database.config'
import { initializePassport } from './config/passport.config'
import { connectRabbitMQ } from './config/rabbitmq.config'
import { startPayoutWorker } from './workers/payout.worker'
import { startPayoutCronJob } from './jobs/payout.job'
import { createServer } from 'http'
import { initializeSocket } from './config/socket.config'

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
    await connectRabbitMQ()
    await startPayoutWorker()
    startPayoutCronJob()

    httpServer.listen(port, ()=> {
        console.log(`Port listening on ${port}`)
    })
}

startServer()