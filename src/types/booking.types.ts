export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    IN_PROGRESS = 'in_progress',
    COMPLETED ='completed'
}

export interface Booking{
    id:string
    customer_id:string
    provider_service_id:string
    scheduled_at:Date
    booking_status: BookingStatus
    customer_location:string
    created_at:Date
    updated_at:Date
}


export type CreateBookingInput = {
    customer_id:string
    provider_service_id:string
    scheduled_at:Date
    customer_location:string
}

export type UpdateBookingStatus = {
    booking_status: BookingStatus
}