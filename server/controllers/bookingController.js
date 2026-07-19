import Booking from "../models/booking.js";
import Room from "../models/room.js";
import User from "../models/user.js";

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const { room, name, email, phone, checkIn, checkOut, guests, totalPrice, status, source } = req.body;
    
    let guestUserId = null;
    const cleanEmail = email?.trim().toLowerCase();
    
    if (req.user && req.user.role === 'user') {
      guestUserId = req.user.id;
    }

    if (cleanEmail) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        guestUserId = existingUser._id;
      }
    }

    const newBooking = new Booking({
      room,
      user: guestUserId,
      name,
      email: cleanEmail,
      phone,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: status || "confirmed",
      source: source || "online"
    });

    const savedBooking = await newBooking.save();
    const populatedBooking = await Booking.findById(savedBooking._id).populate("room", "name location images price");

    if(guestUserId) {
      const points = Math.floor(totalPrice / 10);
      await User.findByIdAndUpdate(guestUserId, { $inc: { loyaltyPoints: points } });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("newBooking", populatedBooking);
      io.emit("statsUpdated");
    }

    res.status(201).json({ status: true, message: "Booking created successfully", data: populatedBooking });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin
// @access  Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room", "name location")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ status: true, data: bookings });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ status: false, message: "Booking not found" });

    booking.status = status;
    await booking.save();

    if (status === 'checked-in' || status === 'active') {
      await Room.findByIdAndUpdate(booking.room, { status: 'Occupied' });
    } else if (status === 'cancelled') {
      await Room.findByIdAndUpdate(booking.room, { status: 'Available' });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("bookingStatusUpdate", booking);
      io.emit("statsUpdated");
    }

    res.status(200).json({ status: true, message: "Booking status updated", data: booking });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ status: false, message: "Booking not found" });

    const io = req.app.get("io");
    if (io) {
      io.emit("statsUpdated");
    }

    res.status(200).json({ status: true, message: "Booking deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// @desc    Get my bookings (Guest)
// @route   GET /api/bookings/me
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId })
      .populate("room", "name location images price")
      .sort({ createdAt: -1 });
    res.status(200).json({ status: true, data: bookings });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
