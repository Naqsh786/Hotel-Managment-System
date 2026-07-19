import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "checked-in", "completed"],
    default: "pending"
  },
  source: {
    type: String,
    enum: ["online", "walk-in"],
    default: "online"
  },
  extraServices: [{
    service: String,
    price: Number
  }],
  partialPayment: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    enum: ["Card", "JazzCash", "EasyPaisa", "Cash", "Stripe", "None"],
    default: "None"
  }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
