import { Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import { findBookingById } from "../services/booking.service";
import { BookingStatus } from "../types/booking.types";
import { fetchReviewById, fetchReviews, findReviewByBookingId, insertReview } from "../services/review.service";
import { CreateReviewInput, Review } from "../types/reviews.types";
import { Role } from "../types/user.types";
import { findProviderByUserId } from "../services/provider.service";


export const createReview = async (req:Request, res:Response) => {
    const {booking_id, rating, comment} = req.body
    const user = req.user

    if (!user || !user.id){
        throw new AppError('Unauthenticated', 401)
    }
    

    if (!booking_id || !rating || !comment){
        throw new AppError('Missing required fields', 400)
    }

    const booking = await findBookingById(booking_id)

    if(!booking){
        throw new AppError('Booking not found!', 404)
    }

    if (booking.customer_id !== user.id) {
        throw new AppError('You are not the customer of this booking', 403)
    }

    if (booking.booking_status !== BookingStatus.COMPLETED){
        throw new AppError('Booking has not been completed', 400)
    }
    

    const existingReview = await findReviewByBookingId(booking_id)

    if(existingReview){
        throw new AppError('Review for this booking already exists', 400)
    }

    const reviewInput:CreateReviewInput = {
        customer_id: user.id,
        provider_user_id: booking.provider_user_id!,
        booking_id,
        comment,
        rating
    }

    // create review record
    const review = await insertReview(reviewInput)

    res.status(201).json({success:true, message:'Review created successfully!', data:review})
}

export const getReviews = async (req:Request, res:Response) => {
    const {limit, page, customerId, providerId} = req.query
    const user = req.user
    let reviews:Review[] = []

    if(!user){
        throw new AppError('Unauthenticated', 401)
    }

    const query = {
        limit: parseInt(limit as string, 10),
        page: parseInt(page as string, 10)
    }

    // check if user is a customer, provider or admin
    if (user.role === Role.CUSTOMER){
       reviews = await fetchReviews(query, user.id)
    } else if (user.role === Role.PROVIDER){
        reviews = await fetchReviews(query, undefined, user.id)
    }

    if(user.role === Role.ADMIN){
        reviews = await fetchReviews(query, customerId as string, providerId as string)
    }

    res.status(200).json({success:true, message:'Fetched reviews successfully', data:reviews})
}

export const getReviewById = async (req:Request, res:Response)=>{
    const {reviewId} = req.params

    if(!reviewId || typeof reviewId !== 'string'){
        return res.status(400).json({message:'Invalid review id'})
    }

    const review = await fetchReviewById(reviewId)

    if(!review){
        return res.status(404).json({message:'Review for booking not found'})
    }
    res.status(200).json({message:'Review retrieved successfully', data:review})
}