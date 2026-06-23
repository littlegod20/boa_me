import { getPool } from "../config/database.config";
import { logger } from "../config/logger.config";
import { QueryType } from "../types/pagination.types";
import { CreateReviewInput, Review } from "../types/reviews.types";


export const insertReview = async (reviewInput:CreateReviewInput):Promise<Review | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            INSERT INTO reviews (customer_id, provider_user_id, booking_id, rating, comment)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `, 
            [
                reviewInput.customer_id,
                reviewInput.provider_user_id,
                reviewInput.booking_id,
                reviewInput.rating,
                reviewInput.comment
            ]
        )
        return result.rows[0] || null
    } catch (error) {
        logger.error('insertReview error', { error })
        throw error   
    }
}

export const findReviewByBookingId = async (booking_id:string):Promise<Review | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(`SELECT * FROM reviews WHERE booking_id = $1`, [booking_id])
        return result.rows[0] || null
    } catch (error) {
        logger.error('findReviewByBookingId error', { error })
        throw error  
    }
}

export const fetchReviews = async ( query:QueryType, customer_id?:string, provider_user_id?:string):Promise<Review[]> => {
    try {
        let conditions = [];
        let values = [];
        let index = 1

        if (customer_id){
            conditions.push(`customer_id=$${index++}`)
            values.push(customer_id)
        }

        if (provider_user_id){
            conditions.push(`provider_user_id=$${index++}`)
            values.push(provider_user_id)
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const limit = query.limit || 10
        const page = query.page || 1
        const offset = (page - 1) * limit

        values.push(limit)
        values.push(offset)
        
        const pool = getPool()
        const result = await pool.query(
            `
            SELECT * FROM reviews
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${index++} OFFSET $${index}
            `,
            values
        );

        return result.rows
    } catch (error) {
        logger.error('fetchCustomerReviews error', { error })
        throw error  
    }
}

export const fetchReviewById = async (review_id:string)=>{
    const pool = getPool()
    try {
        const result = await pool.query(`SELECT * FROM reviews WHERE id=$1`, [review_id])
        return result.rows[0]
    } catch (error) {
        logger.error('fetchReviewById error', {error})
        throw error
    }
}