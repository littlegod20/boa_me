import { Router } from "express";
import { createReview, getReviews } from "../controllers/reviews.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createReviewSchema } from "../validators/review.validator";

const router = Router()

router.post('/', authenticate, validate(createReviewSchema), createReview)
router.get('/', authenticate, getReviews)

export default router