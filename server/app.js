import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/authroutes.js';
import roomRouter from './routes/roomRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import serviceRequestRoutes from './routes/serviceRequestRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';




// Load Env
dotenv.config();

// Initialize Express App
const app = express();



// Top-level connection for environments that support it
try {
    await connectDB();
} catch (err) {
    console.error("Top-level DB connection failed:", err.message);
}

// Database connection is managed at top-level with caching mechanism in db.js




app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware to ensure DB is connected for every request (especially Vercel cold starts)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Critical Database Connection Error in Middleware:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error: Database connection failed",
            error: err.message
        });
    }
});

app.use("/api/auth", router);
app.use("/api/rooms", roomRouter);
app.use("/api/messages", messageRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);

// Root Route - Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hotel Management System Backend API is running",
        version: "1.0.0"
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Caught:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: err.toString()
    });
});

export default app;