import { Router } from "express";
import {
  createBooking,
  getBookingId,
  getBookings,
  changeBookingStatus
} from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { changeBookingStatusSchema, createBookingSchema } from "../validators/booking.validator";

const router = Router();

router.post("/", authenticate, validate(createBookingSchema), createBooking);

router.get("/:id", authenticate, getBookingId);

router.get("/", authenticate, getBookings);

router.patch("/:id/status", authenticate,validate(changeBookingStatusSchema), changeBookingStatus);

export default router;