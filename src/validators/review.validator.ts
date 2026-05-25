import {z} from 'zod'


export const createReviewSchema = z.object({
    booking_id: z.uuid('Invalid booking id'),
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
})

