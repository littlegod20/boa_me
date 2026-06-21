import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, removeCategory, updateCategory } from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";

const router = Router()

router.post('/', authenticate , isAdmin, validate(createCategorySchema), createCategory)
router.get('/', authenticate, getAllCategories)
router.get('/:categoryId', authenticate, getCategoryById)
router.patch('/:categoryId', authenticate, isAdmin, validate(updateCategorySchema), updateCategory)
router.delete('/:categoryId', authenticate, isAdmin, removeCategory)

export default router