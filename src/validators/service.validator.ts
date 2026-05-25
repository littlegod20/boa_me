import { z } from 'zod'

export const createServiceSchema = z.object({
    name: z.string().min(1, 'Service name is required'),
    image: z.string().optional(),
    description: z.string().optional(),
    category_id: z.uuid('Invalid category id')
})

export const updateServiceSchema = createServiceSchema.partial().refine(
    (data) =>
        data.name !== undefined ||
        data.image !== undefined ||
        data.description !== undefined ||
        data.category_id !== undefined,
    { message: 'At least one field must be provided' }
)

export type CreateServiceSchema = z.infer<typeof createServiceSchema>
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>
