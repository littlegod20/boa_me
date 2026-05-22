import { getPool } from "../config/database.config";
import { Booking, BookingStatus, CreateBookingInput } from "../types/booking.types";
import { QueryType } from "../types/pagination.types";
import { Provider } from "../types/provider.types";


export const insertBooking = async(bookingInput: CreateBookingInput): Promise<Booking | null> => {
    try {
        const pool = getPool();
        const result = await pool.query(
            `
            INSERT INTO bookings 
                (customer_id, provider_service_id, scheduled_at, customer_location, booking_status) 
            VALUES 
                ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                bookingInput.customer_id,
                bookingInput.provider_service_id,
                bookingInput.scheduled_at,
                bookingInput.customer_location,
                BookingStatus.PENDING
            ]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
}

export const findBookingById = async(bookingId: string): Promise<Booking | null> => {
    try {
        const pool = getPool();
        const result = await pool.query(
            `SELECT 
                bookings.*,
                users.name as customer_name,
                provider_services.price,
                services.name as service_name,
                provider_users.name as provider_name
            FROM bookings
            LEFT JOIN users ON bookings.customer_id = users.id
            LEFT JOIN provider_services ON bookings.provider_service_id = provider_services.id
            LEFT JOIN services ON provider_services.service_id = services.id
            LEFT JOIN providers ON provider_services.provider_id = providers.id
            LEFT JOIN users AS provider_users ON providers.user_id = provider_users.id
            WHERE bookings.id = $1
            `,
            [bookingId]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
}

export const fetchBookings = async(
    query: QueryType,
    customer_id?: string,
    provider_id?: string,
    status?: BookingStatus
): Promise<Booking[] | null> => {
    try {
        const pool = getPool();
        const conditions: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (customer_id) {
            conditions.push(`customer_id = $${index++}`);
            values.push(customer_id);
        }

        if (provider_id) {
            conditions.push(`provider_service_id IN (SELECT id FROM provider_services WHERE provider_id = $${index++})`);
            values.push(provider_id);
        }

        if (status) {
            conditions.push(`booking_status = $${index++}`);
            values.push(status);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const offset = (page - 1) * limit;
        values.push(limit);
        values.push(offset);

        const result = await pool.query(
            `
            SELECT * FROM bookings
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${index++} OFFSET $${index}
            `,
            values
        );

        return result.rows || null;
    } catch (error) {
        throw error;
    }
}

export const updateBookingStatus = async (
    bookingId: string,
    update: { booking_status: BookingStatus }
): Promise<Booking | null> => {
    try {
        const pool = getPool();
        const result = await pool.query(
            `
            UPDATE bookings
            SET booking_status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
            `,
            [update.booking_status, bookingId]
        );
        return result.rows[0] || null;
    } catch (error) {
        throw error;
    }
}


export const isBookingProvider = async (bookingId: string, userId: string): Promise<boolean> => {
    const pool = getPool()
    const result = await pool.query(`
        SELECT 1 FROM bookings
        JOIN provider_services ON bookings.provider_service_id = provider_services.id
        JOIN providers ON provider_services.provider_id = providers.id
        WHERE bookings.id = $1 AND providers.user_id = $2
    `, [bookingId, userId])
    return (result.rowCount ?? 0) > 0
}