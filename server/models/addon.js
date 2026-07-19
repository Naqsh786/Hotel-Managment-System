import mongoose from 'mongoose';

const addonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Add-on name is required"],
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  icon: {
    type: String,
    default: 'Box'
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const Addon = mongoose.model('Addon', addonSchema);
export default Addon;
