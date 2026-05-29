import { z } from 'zod'

export const createConversationSchema = z.object({
    provider_id: z.uuid('Invalid provider id'),
    booking_id: z.uuid('Invalid booking id').optional(),
})

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
})

export const conversationIdParamSchema = z.object({
    conversationId: z.uuid('Invalid conversation id'),
})

export type CreateConversationSchema = z.infer<typeof createConversationSchema>
export type PaginationQuerySchema = z.infer<typeof paginationQuerySchema>
export type ConversationIdParamSchema = z.infer<typeof conversationIdParamSchema>
