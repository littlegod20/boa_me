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

export const findUserByVerificationToken = async (token:string): Promise< User | null > => {
    const pool = getPool()
    try {
        const result = await pool.query(`SELECT * FROM users WHERE email_verification_token = $1`, [token])
        return result.rows[0] || null

    } catch (error) {
        throw error
    }
}

export const verifyUserEmail = async (id:string) => {
    const pool = getPool()
    try {
        // get user by email and update email_verified_at, email_verification_token and email_verification_token_expires_at
        const result = await pool.query(`
            UPDATE users 
            SET email_verified_at = $1, email_verification_token = $2, email_verification_token_expires_at= $3
            WHERE id = $4
            RETURNING *`,
            [
                new Date(),
                null,
                null,
                id
            ]
        )

        return result.rows[0]
    } catch (error) {
        throw error
    }
}