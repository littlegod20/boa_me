import { Pool } from "pg"


let pool: Pool | undefined

export const connectDB = async () => {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL
    })
    try{
        await pool.connect()
        console.log('Database connected successfully')
    } catch(error){
        console.error(`Database connection error: ${error}`)
        process.exit(1)
    }
}

export const getPool = () => {
    if (!pool) throw new Error('Database not connected')
    return pool
}





