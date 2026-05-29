import morgan from 'morgan'
import { logger } from '../config/logger.config'
import { Request, Response } from 'express'


// a write stream that pipes to Winston
const stream = {
    write: (message:string)=>{
        logger.http(message.trim())
    }
}

// skip logging for health check route
const skip = (req: Request) => {
    return req.path === '/health'
}

export const morganMiddleware = morgan(
    ':remote-addr :method :url :status :res[content-length] - :response-time ms :user-agent',
    {stream, skip}
)