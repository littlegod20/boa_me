import { Router } from "express";
import {
  createBooking,
  getBookingId,
  getBookings,
  changeBookingStatus
} from "../controllers/booking.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, createBooking);

router.get("/:id", authenticate, getBookingId);

router.get("/", authenticate, getBookings);

router.patch("/:id/status", authenticate, changeBookingStatus);

export default router;