import { Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import { BookingStatus, CreateBookingInput } from "../types/booking.types";
import { findBookingById, fetchBookings, updateBookingStatus, insertBooking, isBookingProvider } from "../services/booking.service";
import { Role } from "../types/user.types";


export const createBooking = async (req:Request, res:Response) => {
    const user = req.user
    const {provider_service_id, scheduled_at, customer_location} = req.body

    if(!user){
        throw new AppError('Unauthorized', 401)
    }

    if (!provider_service_id || !scheduled_at || !customer_location){
        throw new AppError('Missing required fields: provider_service_id, scheduled_at, customer_location', 400)
    }

    const input:CreateBookingInput =  {
        customer_id: user.id,
        provider_service_id,
        scheduled_at,
        customer_location
    }

    const result = await insertBooking(input)

    if(!result){
        throw new AppError('Failed to book service', 500)
    }

    res.status(201).json({success:true, message:'Service booked successfully!'})
}


export const getBookingId = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError('Missing booking ID', 400);
    }

    const booking = await findBookingById(id as string);

    if (!booking) {
        throw new AppError('Booking not found', 404);
    }

    res.status(200).json({ success: true, data: booking });
};

export const getBookings = async (req: Request, res: Response) => {
    const user = req.user
    const { page, limit, status, as } = req.query

    if (!user) throw new AppError('Unauthorized', 401)

    // determine filter based on who is asking
    let customer_id: string | undefined
    let provider_id: string | undefined

    if (as === 'provider') {
        provider_id = user.id  // show bookings where user is the provider
    } else {
        customer_id = user.id  // default: show bookings where user is the customer
    }

    // admin sees all
    if (user.role === Role.ADMIN) {
        customer_id = undefined
        provider_id = undefined
    }

    // status filter
    let statusEnum: BookingStatus | undefined
    if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
        statusEnum = status as BookingStatus
    }

    const result = await fetchBookings(
        { page: Number(page) || 1, limit: Number(limit) || 10 },
        customer_id,
        provider_id,
        statusEnum
    )

    res.status(200).json({ success: true, data: result })
}

export const changeBookingStatus = async (req: Request, res: Response) => {
    const user = req.user 
    const { id } = req.params;
    const { booking_status } = req.body;

    if (!user){
        throw new AppError('Unauthenticated!', 401)
    }

    if (!id) {
        throw new AppError('Missing booking ID', 400);
    }
    if (!booking_status || !Object.values(BookingStatus).includes(booking_status)) {
        throw new AppError('Invalid or missing booking status', 400);
    }

    const booking = await findBookingById(id as string)

    if(!booking){
        throw new AppError('Booking not found', 404)
    }

    // check if the booking is for a customer or a provider
    const isCustomer = booking.customer_id === user.id
    const isAdmin = user.role === Role.ADMIN

    // customer role can't update status to confirmed, inprogress or completed
    if(isCustomer && !isAdmin){
        if (
            booking_status === BookingStatus.CONFIRMED ||
            booking_status === BookingStatus.IN_PROGRESS ||
            booking_status === BookingStatus.COMPLETED
        ) {
            throw new AppError('Customers can only cancel bookings', 403)
        }
    }

    if (!isCustomer && !isAdmin) {
        // verify that this user is actually the provider of this booking
        const isProviderBooking = await isBookingProvider(id as string,user.id)

        if(!isProviderBooking){
            throw new AppError('You are not associated with this booking', 403)
        }
        
        if (booking_status === BookingStatus.PENDING) {
            throw new AppError('Providers cannot set bookings back to pending', 403)
        }
    }

    // valid status transitions
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
        [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
        [BookingStatus.CONFIRMED]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
        [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
        [BookingStatus.COMPLETED]: [],
        [BookingStatus.CANCELLED]: []
    }
    

    // check if the transition is valid
    const allowedNextStatuses = validTransitions[booking.booking_status]
    if (!allowedNextStatuses.includes(booking_status)){
        throw new AppError(
            `Cannot transition from ${booking.booking_status} to ${booking_status}`,
            400
        )
    }

    const updated = await updateBookingStatus(id as string, { booking_status });

    if (!updated) {
        throw new AppError('Booking not found or update failed', 404);
    }

    res.status(200).json({ success: true, data: updated });
};