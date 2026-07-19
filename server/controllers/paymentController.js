import Stripe from 'stripe';
import dotenv from 'dotenv';
import Booking from '../models/booking.js';

dotenv.config();

// Initialize Stripe lazily to avoid crash if key is missing at startup
let stripe;
const getStripe = () => {
    if (!stripe) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
};

/**
 * Create a Stripe Checkout Session
 * POST /api/payment/create-checkout-session
 */
export const createCheckoutSession = async (req, res) => {
    try {
        const { roomName, price, quantity, bookingId } = req.body;

        if (!roomName || !price || !quantity || !bookingId) {
            return res.status(400).json({ 
                status: false, 
                message: "Missing required payment details (roomName, price, quantity, bookingId)" 
            });
        }

        // Create checkout session
        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: roomName,
                            description: `Booking for ${roomName}`,
                        },
                        unit_amount: Math.round(price * 100), // Stripe expects amount in cents
                    },
                    quantity: quantity,
                },
            ],
            mode: 'payment',
            // Pass booking data in metadata so we can retrieve it after success if needed
            metadata: {
                bookingId: bookingId
            },
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/cancel`,
        });

        res.json({ 
            status: true, 
            id: session.id,
            url: session.url 
        });
    } catch (error) {
        console.error("Stripe Session Error:", error);
        res.status(500).json({ 
            status: false, 
            message: error.message || "Failed to create checkout session" 
        });
    }
};

/**
 * Confirm Booking after successful payment
 * POST /api/payment/confirm-booking
 */
export const confirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ status: false, message: "Booking ID is required" });
        }

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'confirmed' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ status: false, message: "Booking not found" });
        }

        res.json({ status: true, message: "Booking confirmed successfully", booking });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};
