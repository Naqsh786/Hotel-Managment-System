import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Room name is required"],
    trim: true
  },
  maxPerson: {
    type: Number,
    required: [true, "Max person capacity is required"],
    default: 2
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price per night is required"]
  },
  type: {
    type: String,
    required: [true, "Room type is required"],
    enum: ["Standard", "Deluxe", "Suite", "Royal", "Family"],
    default: "Standard"
  },
  status: {
    type: String,
    enum: ["Available", "Booked", "Maintenance", "Maintenance Progress", "Cleaning", "Cleaning Progress", "Unavailable"],
    default: "Available"
  },
  images: {
    type: [String],
    required: [true, "At least one image is required"],
    validate: [arrayLimit, '{PATH} must have at least one image']
  },
  amenities: {
    type: [String],
    default: ["Wifi", "Coffee", "AC", "Smart TV"]
  },
  description: {
    type: String,
    default: "A luxury stay with high-quality service and premium comfort."
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length > 0;
}

const Room = mongoose.model('Room', roomSchema);
export default Room;
