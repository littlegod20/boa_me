import { getPool } from "../config/database.config"
import { logger } from "../config/logger.config"
import { CreateTransaction, Transaction, TransactionStatus } from "../types/transaction.types"


export const insertTransaction = async (input:CreateTransaction):Promise<Transaction | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            INSERT INTO transactions (booking_id, customer_user_id, provider_user_id, payment_id, amount, transaction_type, transaction_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [
                input.booking_id,
                input.customer_user_id,
                input.provider_user_id,
                input.payment_id,
                input.amount,
                input.transaction_type,
                input.transaction_status
            ]
        )
        return result.rows[0] || null
    } catch (error) {
        logger.error('insert transaction error', { error })
        throw error
    }
}


export const findTransactionByBookingId = async(booking_id:string):Promise<Transaction | null>=>{
    try {
        const pool = getPool()
        const result = await pool.query(`SELECT * FROM transactions WHERE booking_id = $1`, [booking_id])
        return result.rows[0] || null 
    } catch (error) {
        logger.error('findTransactionByBookingId error', { error })
        throw error
    }
}

export const updateTransaction = async(transaction_id:string, transaction_status:TransactionStatus):Promise<Transaction | null>=>{
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            UPDATE transactions
            SET transaction_status=$1,
                updated_at=NOW()
            WHERE id=$2
            RETURNING *
            `,
            [transaction_status, transaction_id]
        )
        return result.rows[0] || null
    } catch (error) {
        logger.error('updateTransaction error', { error })
        throw error
    }
}