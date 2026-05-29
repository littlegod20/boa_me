import { Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import { findBookingById } from "../services/booking.service";
import { fetchMessages, fetchUserConversations, findConversationById, findConversationsBetweenUsers, insertConversation } from "../services/conversation.service";
import { Booking } from "../types/booking.types";


export const createConversation = async(req:Request, res:Response) => {
    const user = req.user
    const {booking_id, provider_id} = req.body
    
    if(!user) throw new AppError('Unauthenticated', 401)

    if (!provider_id){
        throw new AppError('Missing provider id', 400)
    }

    let existingBooking:Booking | null

    if(booking_id){
        // find if booking exists
        existingBooking = await findBookingById(booking_id)
        
        if(!existingBooking){
            throw new AppError('Booking not found', 404)
        }
    }

    const existingConvo = await findConversationsBetweenUsers(user.id, provider_id)
    if (existingConvo.length > 0) {
        return res.status(200).json({ 
            success: true, 
            message: 'Conversation already exists', 
            data: existingConvo[0] 
        })
    }

    const conversation = await insertConversation({
        booking_id,
        customer_id: user.id,
        provider_id
    })

    res.status(201).json({success:true, message:"Conversation created successfully", data:conversation})
}

export const getUserConversations = async(req:Request, res:Response) => {
    const user = req.user
    const {limit, page} = req.query
    if (!user) throw new AppError('Unauthorized', 401)

    const query = {
        limit: parseInt(limit as string, 10),
        page: parseInt(page as string, 10)
    }

    
    const convos = await fetchUserConversations(query, user.id)

    res.status(200).json({success:true, message:'User conversations fetched successfully', data:convos})
}

export const getConversationMessages = async(req:Request, res:Response) => {
    const {conversationId} = req.params
    const {page, limit} = req.query
    const user = req.user

    if(!user) throw new AppError('Unauthenticated', 401)

    if(!conversationId){
        throw new AppError('Missing conversation id', 400)
    }

    const conversation = await findConversationById(conversationId as string)
    if (!conversation) throw new AppError('Conversation not found', 404)
    
    if (conversation.customer_id !== user.id && conversation.provider_id !== user.id) {
        throw new AppError('You are not part of this conversation', 403)
    }
    
    const query = {
        limit: parseInt(limit as string, 10),
        page: parseInt(page as string, 10)
    }

    const convoMessages = await fetchMessages(query, conversationId as string)

    res.status(200).json({success:true, message:'Conversation messages fetched successfully', data:convoMessages})
} 