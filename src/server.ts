import {config} from 'dotenv'
import { createApp } from "./app"
import { connectDB } from './config/database.config'
import { initializePassport } from './config/passport.config'

config()
initializePassport()

const startServer = async () => {
    const port = process.env.PORT || 3000
    const server = createApp()
    await connectDB()

    server.listen(port, ()=> {
        console.log(`Port listening on ${port}`)
    })
}

startServer()