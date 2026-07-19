import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: "Box"
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Amenity = mongoose.model("Amenity", amenitySchema);
export default Amenity;
