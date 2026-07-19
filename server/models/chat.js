import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverRole: { type: String, required: true }, // "admin", "manager", "receptionist", "guest"
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Specific user if guest
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);
