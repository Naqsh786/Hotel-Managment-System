import express from 'express';
import { createCheckoutSession, confirmBooking } from '../controllers/paymentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Only authenticated users should be able to create payment sessions
router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/confirm-booking', protect, confirmBooking);

export default router;
