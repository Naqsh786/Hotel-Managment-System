import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },
    phoneNumber: { type: String },
    address: { type: String },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended", "Pending"],
      default: "Active"
    },
    responsibility: {
      type: String,
      enum: ["Housekeeping", "Receptionist", "Manager", "Security", "Maintenance", "Room Service", "Other"],
      default: "Other"
    },
    shift: {
      type: String,
      enum: ["Morning", "Evening", "Night", "OFF"],
      default: "Morning"
    },
    workArea: { type: String, default: "General" },
    cnic: { type: String },
    preferences: {
      type: [String],
      default: []
    },
    familyMembers: [{
      name: String,
      relation: String,
      age: Number
    }],
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    profileImage: { type: String, default: "" },
    verificationToken: String,
    resetToken: String,
    otpExpires: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
