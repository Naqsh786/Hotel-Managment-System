import Room from '../models/room.js';

// ==========================
// ADMIN: CREATE ROOM
// ==========================
export const addRoom = async (req, res) => {
  try {
    const { name, maxPerson, location, price, type, description } = req.body;
    
    // Extract Cloudinary URLs from req.files
    if (!req.files || req.files.length < 4) {
      return res.status(400).json({ status: false, message: "At least 4 images are required" });
    }


    const imageUrls = req.files.map(file => file.path); // Cloudinary path is the URL

    const room = await Room.create({
      name,
      maxPerson,
      location,
      price,
      type,
      description,
      images: imageUrls
    });

    res.status(201).json({
      status: true,
      message: "Room added successfully",
      data: room
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// ADMIN: GET ROOMS (WITH PAGINATION & SEARCH)
// ==========================
export const getAdminRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const type = req.query.type || "";

    const query = {
      name: { $regex: search, $options: "i" }
    };

    if (type) query.type = type;

    const totalRooms = await Room.countDocuments(query);
    const rooms = await Room.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: true,
      data: rooms,
      pagination: {
        total: totalRooms,
        page,
        pages: Math.ceil(totalRooms / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// PUBLIC: GET ALL ROOMS
// ==========================
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json({ status: true, data: rooms });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// PUBLIC: GET SINGLE ROOM
// ==========================
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ status: false, message: "Room not found" });
    res.json({ status: true, data: room });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// ADMIN: UPDATE ROOM
// ==========================
export const updateRoom = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If new images are uploaded, update them
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    if (!room) return res.status(404).json({ status: false, message: "Room not found" });

    // Emit real-time event
    const io = req.app.get("io");
    if (io) {
      io.emit("roomStatusUpdate", room);
    }

    res.json({ status: true, message: "Room updated successfully", data: room });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// ADMIN: DELETE ROOM
// ==========================
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ status: false, message: "Room not found" });
    res.json({ status: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
