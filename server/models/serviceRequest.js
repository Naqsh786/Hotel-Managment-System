import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  type: {
    type: String,
    enum: ["Cleaning", "Food", "Laundry", "Maintenance", "Reception", "Other"],
    required: true
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Cancelled"],
    default: "Pending"
  },
  notes: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model("ServiceRequest", serviceRequestSchema);
