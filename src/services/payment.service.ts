import { getPool } from "../config/database.config";
import { QueryType } from "../types/pagination.types";
import { CreatePaymentInput, Payment, PaymentStatus } from "../types/payment.types";


export const insertPayment = async(paymentInput:CreatePaymentInput):Promise<Payment | null>=>{
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            INSERT INTO payments (customer_id, booking_id, amount, payment_date, payment_status, paystack_reference)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `, 
            [
                paymentInput.customer_id,
                paymentInput.booking_id,
                paymentInput.amount,
                paymentInput.payment_date,
                PaymentStatus.PENDING,
                paymentInput.paystack_reference
            ]
        )
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
}

export const findPaymentByReference = async (reference:string):Promise<Payment | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            SELECT * FROM payments WHERE paystack_reference=$1
            `,
            [reference]
        )
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
}

export const findPaymentByBookingId = async(booking_id:string):Promise<Payment | null>=>{
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            SELECT * FROM payments WHERE booking_id=$1
            `,
            [booking_id]
        )
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
}

export const updatePaymentStatus = async(reference:string, payment_status:PaymentStatus):Promise<Payment | null>=>{
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            UPDATE payments
            SET payment_status=$1  
            WHERE paystack_reference=$2
            RETURNING *
            `,
            [
                payment_status,
                reference
            ]
        )
        return result.rows[0] || null
    } catch (error) {
        throw error
    }
}

export const fetchPayments = async(customer_id:string, query:QueryType):Promise<Payment[] | null> =>{
    try {
        const conditions = []
        const values = []
        let index = 1

        if (customer_id){
            conditions.push(`payments.customer_id=$${index++}`)
            values.push(customer_id)
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        const page = query.page || 1
        const limit = query.limit || 10
        const offset = (page - 1) * limit
        values.push(limit)
        values.push(offset)

        const pool = getPool()
        const result = await pool.query(
            `
            SELECT * FROM payments
            ${whereClause}
            LIMIT $${index++} OFFSET $${index++}
            `, values
        )
        return result.rows || null
    } catch (error) {
        throw error
    }
}
