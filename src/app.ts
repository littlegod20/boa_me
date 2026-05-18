import express from "express"
import cors from 'cors'
import helmet from 'helmet'



export const createApp = () => {
    const app = express()

    app.use(express.json())
    app.use(cors())
    app.use(helmet())

    app.get('/health',(req, res)=> {
        res.send('Ok')
    })
    
    return app
}
