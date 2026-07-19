import Amenity from "../models/amenity.js";

export const getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find().sort({ createdAt: -1 });
    res.json({ status: true, data: amenities });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.create(req.body);
    res.json({ status: true, message: "Amenity created successfully", data: amenity });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!amenity) return res.status(404).json({ status: false, message: "Amenity not found" });
    res.json({ status: true, message: "Amenity updated successfully", data: amenity });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndDelete(req.params.id);
    if (!amenity) return res.status(404).json({ status: false, message: "Amenity not found" });
    res.json({ status: true, message: "Amenity deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
