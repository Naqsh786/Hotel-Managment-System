import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config({ quiet: true });

// Force Google DNS to bypass ISP/local DNS blocking of MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

let cached = globalThis.mongoose;

if (!cached) {
    cached = globalThis.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            family: 4
        };

        const mongoUri = process.env.DATABASE;
        if (!mongoUri) {
            throw new Error("DATABASE is not defined in .env file");
        }

        cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
            console.log("✅ MongoDB Connected Successfully");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("❌ MongoDB Connection Error:", e.message);
        throw e;
    }

    return cached.conn;
}

export default connectDB;
