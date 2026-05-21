import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router()

router.post('/', authenticate , isAdmin, createCategory)
router.get('/',  getAllCategories)
router.get('/:categoryId', getCategoryById)
router.patch('/:categoryId', authenticate, isAdmin, updateCategory)

export default router