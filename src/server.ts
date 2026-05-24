import {config} from 'dotenv'
import { createApp } from "./app"
import { connectDB } from './config/database.config'
import { initializePassport } from './config/passport.config'
import { connectRabbitMQ } from './config/rabbitmq.config'
import { startPayoutWorker } from './workers/payout.worker'
import { startPayoutCronJob } from './jobs/payout.job'

config()
initializePassport()

const startServer = async () => {
    const port = process.env.PORT || 3000
    const server = createApp()
    await connectDB()
    await connectRabbitMQ()
    await startPayoutWorker()
    await startPayoutCronJob()

    server.listen(port, ()=> {
        console.log(`Port listening on ${port}`)
    })
}

startServer()