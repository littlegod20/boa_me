import { z } from 'zod'

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    description: z.string().optional()
})

export const updateCategorySchema = createCategorySchema.partial().refine(
    (data) => data.name !== undefined || data.description !== undefined,
    { message: 'At least one field must be provided' }
)

export type CreateCategorySchema = z.infer<typeof createCategorySchema>
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>
