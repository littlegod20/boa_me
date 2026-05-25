import {z} from 'zod'
import { BookingStatus } from '../types/booking.types'

export const createBookingSchema = z.object({
    provider_service_id: z.uuid('Invalid provider service id'),
    scheduled_at: z.iso.datetime().refine(
        date => new Date(date) > new Date(),
        {message: 'Scheduled date must be in the future'}
    ),
    customer_location: z.string().min(1,'Location is required')
})

export const changeBookingStatusSchema = z.object({
    booking_status: z.enum(Object.values(BookingStatus) as [string, ...string[]])
})

export type CreateBookingSchema = z.infer<typeof createBookingSchema>
export type ChangeBookingStatusSchema = z.infer<typeof changeBookingStatusSchema>