import { Pool } from "pg"
import { logger } from "./logger.config"


let pool: Pool | undefined

export const connectDB = async () => {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL
    })
    try{
        const client = await pool.connect()
        client.release()
        logger.info('Database connected successfully')
    } catch(error){
        logger.error('Database connection error', { error })
        process.exit(1)
    }
}

export const getPool = () => {
    if (!pool) throw new Error('Database not connected')
    return pool
}





