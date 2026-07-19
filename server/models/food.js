import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Food name is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Breakfast", "Main Course", "Salads", "Quick Bites", "Dessert", "Beverages"],
    default: "Main Course"
  },
  status: {
    type: String,
    enum: ["Available", "Unavailable"],
    default: "Available"
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=300&fit=crop"
  }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);
export default Food;
