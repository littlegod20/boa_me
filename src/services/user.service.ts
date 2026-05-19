import { CreateUserInput, User } from "../types/user.types";
import { getPool } from "../config/database.config";


export const findUserByEmail = async (email:string): Promise<User|null> => {
    const pool = getPool()
    try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
}

export const createUser = async (input: CreateUserInput): Promise<User>=>{
    const pool = getPool()
    try {
        const result = await pool.query(`
            INSERT INTO users (name, email, password, role, email_verification_token, email_verification_token_expires_at, address, profile_picture, phone_number)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
            `, 
            [
                input.name,
                input.email,
                input.password,
                input.role,
                input.email_verification_token,
                input.email_verification_token_expires_at,
                input.address,
                input.profile_picture,
                input.phone_number
            ]
        )
        return result.rows[0]
    } catch (error) {
        throw error
    }
}