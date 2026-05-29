import { getPool } from "../config/database.config";
import { logger } from "../config/logger.config";
import { Conversation, CreateConversationInput, CreateMessageInput, Message } from "../types/conversation.types";
import { QueryType } from "../types/pagination.types";


export const insertConversation = async (conversationInput:CreateConversationInput):Promise<Conversation | null>=>{
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            INSERT INTO conversations (booking_id, customer_id, provider_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [
                conversationInput.booking_id,
                conversationInput.customer_id,
                conversationInput.provider_id
            ]
        )

        return result.rows[0] || null
    } catch (error) {
        logger.error('insertConversation error', { error })
        throw error
    }
}

export const findConversationById = async (conversationId:string):Promise<Conversation | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            SELECT * FROM conversations WHERE id=$1
            `, [conversationId]
        )
        return result.rows[0] || null
    } catch (error) {
        logger.error('findConversationById error', { error })
        throw error
    }
}

export const findConversationByBookingId = async(bookingId:string):Promise<Conversation | null> => {
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            SELECT * FROM conversations WHERE booking_id=$1
            `, [bookingId]
        )
        return result.rows[0] || null
    } catch (error) {
        logger.error('findConversationByBookingId error', { error })
        throw error
    }
}

export const findConversationsBetweenUsers = async(customerId:string, providerId:string):Promise<Conversation[]> => {
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            SELECT * FROM conversations WHERE customer_id=$1 AND provider_id=$2
            `, [customerId, providerId]
        )
        return result.rows
    } catch (error) {
        logger.error('findConversationsBetweenUsers error', { error })
        throw error
    }
}


export const fetchUserConversations = async(query:QueryType, userId:string):Promise<Conversation[]>=>{
    try {
        const page = query.page || 1
        const limit = query.limit || 10
        const offset = (page - 1) * limit

        const pool = getPool()
        const result = await pool.query(
            `
            SELECT * FROM conversations WHERE customer_id = $1 OR provider_id=$1
            LIMIT $2 OFFSET $3
            `,
            [userId, limit, offset]
        )
        return result.rows
    } catch (error) {
        logger.error('fetchUserConversations error', { error })
        throw error
    }
}


export const insertMessage = async(messageInput:CreateMessageInput):Promise<Message | null>=>{
    try {
        const pool = getPool()
        const result = await pool.query(
            `
            INSERT INTO messages (content, conversation_id, sender_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `, 
            [
                messageInput.content,
                messageInput.conversation_id,
                messageInput.sender_id
            ]
        )
        return result.rows[0] || null
    } catch (error) {
        logger.error('insertMessage error', { error })
        throw error
    }
}


export const fetchMessages = async(query:QueryType, conversationId?:string):Promise<Message[]> => {
    try {

        const values = []
        const conditions = []
        let index = 1
        
        if(conversationId){
            conditions.push(`conversation_id=$${index++}`)
            values.push(conversationId)
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
            SELECT * FROM messages
            ${whereClause}
            ORDER BY created_at ASC
            LIMIT $${index++} OFFSET $${index}
            `,
            values
        )
        return result.rows || null
    } catch (error) {
        logger.error('fetchMessages error', { error })
        throw error
    }
}