import { Router } from "express";
import { createReview, getReviews } from "../controllers/reviews.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router()

router.post('/', authenticate, createReview)
router.get('/', authenticate, getReviews)

export default router