import User from "../models/user.js";
import HomeSetting from "../models/homeSetting.js";
import Booking from "../models/booking.js";
import Room from "../models/room.js";
import bcrypt from "bcryptjs";

// ==========================
// USER MANAGEMENT
// ==========================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ status: true, data: users });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// ADMIN: DELETE USER
// ==========================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    res.json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    // Don't allow modifying an admin's status
    if (user.role === "admin") {
        return res.status(400).json({ status: false, message: "Cannot change an admin's status" });
    }

    if (!["Active", "Inactive", "Suspended", "Pending"].includes(status)) {
        return res.status(400).json({ status: false, message: "Invalid status" });
    }

    user.status = status;
    await user.save();

    res.json({ status: true, message: `User status changed to ${status}`, data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// HOME SETTINGS
// ==========================

export const getHomeSettings = async (req, res) => {
  try {
    let settings = await HomeSetting.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await HomeSetting.create({
        heroSlides: [
          { 
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60", 
            title: "Experience Pure Serenity", 
            subtitle: "Where luxury meets the whispers of nature in perfect harmony." 
          }
        ],
        visibleCategories: [
          { 
            title: "Spa & Wellness", 
            desc: "Relax and rejuvenate your soul.", 
            image: "https://images.unsplash.com/photo-1544161515-450a91adbd35?auto=format&fit=crop&w=600&q=80",
            isVisible: true 
          }
        ]
      });
    }
    res.json({ status: true, data: settings });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateHomeSettings = async (req, res) => {
  try {
    let settings = await HomeSetting.findOne();
    if (!settings) {
      settings = new HomeSetting(req.body);
    } else {
      settings.heroSlides = req.body.heroSlides || settings.heroSlides;
      settings.visibleCategories = req.body.visibleCategories || settings.visibleCategories;
    }

    await settings.save();
    res.json({ status: true, message: "Settings updated successfully", data: settings });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// DASHBOARD STATS
// ==========================
export const getDashboardStats = async (req, res) => {
  try {
    const { range = 'W' } = req.query;
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Total Users
    const totalUsers = await User.countDocuments({ role: 'user' });
    const lastMonthUsers = await User.countDocuments({ 
      role: 'user', 
      createdAt: { $lt: currentMonthStart } 
    });
    const usersTrend = lastMonthUsers > 0 
      ? (((totalUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1) 
      : "0";

    // New Bookings (This Month)
    const newBookingsCount = await Booking.countDocuments({ 
      status: 'confirmed',
      createdAt: { $gte: currentMonthStart }
    });
    const lastMonthBookings = await Booking.countDocuments({
      status: 'confirmed',
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart }
    });
    const bookingsTrend = lastMonthBookings > 0
      ? (((newBookingsCount - lastMonthBookings) / lastMonthBookings) * 100).toFixed(1)
      : "0";

    // Total Revenue
    const allBookings = await Booking.find({ status: { $in: ['confirmed', 'completed', 'checked-in'] } });
    const totalRevenue = allBookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    
    const currentMonthRevenue = allBookings
      .filter(b => new Date(b.createdAt) >= currentMonthStart)
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    
    const lastMonthRevenue = allBookings
      .filter(b => new Date(b.createdAt) >= lastMonthStart && new Date(b.createdAt) < currentMonthStart)
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    const revenueTrend = lastMonthRevenue > 0
      ? (((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
      : "0";

    // Total Staff
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const lastMonthStaff = await User.countDocuments({ 
      role: 'staff', 
      createdAt: { $lt: currentMonthStart } 
    });
    const staffTrend = lastMonthStaff > 0 
      ? (((totalStaff - lastMonthStaff) / lastMonthStaff) * 100).toFixed(1) 
      : "0";

    // Occupancy
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Revenue chart data based on range
    let revenueChart = [];
    let chartLabels = [];

    if (range === 'W') {
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      revenueChart = await Promise.all(last7Days.map(async (date) => {
        const dayStart = new Date(date);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const dayBookings = allBookings.filter(b => 
          new Date(b.createdAt) >= dayStart && new Date(b.createdAt) <= dayEnd
        );
        return dayBookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
      }));
      chartLabels = last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' }));
    } else if (range === 'M') {
      // Last 30 days
      const periods = 10;
      revenueChart = [...Array(periods)].map((_, i) => {
        const start = new Date();
        start.setDate(now.getDate() - (periods - i) * 3);
        const end = new Date();
        end.setDate(now.getDate() - (periods - i - 1) * 3);
        const periodBookings = allBookings.filter(b => 
          new Date(b.createdAt) >= start && new Date(b.createdAt) <= end
        );
        return periodBookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
      });
      chartLabels = [...Array(periods)].map((_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (periods - i) * 3);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
    } else if (range === 'Y') {
      // Last 12 months
      const last12Months = [...Array(12)].map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        return d;
      });

      revenueChart = last12Months.map(monthStart => {
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        const monthBookings = allBookings.filter(b => 
          new Date(b.createdAt) >= monthStart && new Date(b.createdAt) <= monthEnd
        );
        return monthBookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
      });
      chartLabels = last12Months.map(d => d.toLocaleDateString('en-US', { month: 'short' }));
    }

    const targetRevenue = 50000;
    const revenueTargetProgress = Math.min(Math.round((totalRevenue / targetRevenue) * 100), 100);

    const avgBookingValue = allBookings.length > 0 
      ? Math.round(totalRevenue / allBookings.length) 
      : 0;

    res.json({
      status: true,
      data: {
        totalUsers,
        usersTrend: { value: usersTrend, up: parseFloat(usersTrend) >= 0 },
        totalStaff,
        staffTrend: { value: staffTrend, up: parseFloat(staffTrend) >= 0 },
        newBookings: newBookingsCount,
        bookingsTrend: { value: bookingsTrend, up: parseFloat(bookingsTrend) >= 0 },
        totalRevenue,
        revenueTrend: { value: revenueTrend, up: parseFloat(revenueTrend) >= 0 },
        avgBookingValue,
        revenueTarget: revenueTargetProgress,
        occupancyRate,
        activeRooms: occupiedRooms,
        totalRooms,
        revenueChart,
        chartLabels
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// STAFF MANAGEMENT
// ==========================

export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("-password");
    res.json({ status: true, data: staff });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, responsibility, shift, workArea } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ status: false, message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImage = "";
    if (req.file) {
      profileImage = req.file.path;
    }

    const staff = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "staff",
      phoneNumber,
      address,
      responsibility: responsibility || "Other",
      shift: shift || "Morning",
      workArea: workArea || "General",
      profileImage,
      isVerified: true
    });

    const staffResponse = staff.toObject();
    delete staffResponse.password;

    res.json({ status: true, message: "Staff member added successfully", data: staffResponse });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, address, password, status, responsibility, shift, workArea } = req.body;
    
    const staff = await User.findById(id);
    if (!staff) return res.status(404).json({ status: false, message: "Staff not found" });

    if (email && email !== staff.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ status: false, message: "Email already exists" });
      staff.email = email;
    }

    staff.name = name || staff.name;
    staff.phoneNumber = phoneNumber || staff.phoneNumber;
    staff.address = address || staff.address;
    if (responsibility) staff.responsibility = responsibility;
    if (shift) staff.shift = shift;
    if (workArea) staff.workArea = workArea;
    if (status) staff.status = status;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      staff.profileImage = req.file.path;
    }

    await staff.save();
    
    const staffResponse = staff.toObject();
    delete staffResponse.password;

    res.json({ status: true, message: "Staff updated successfully", data: staffResponse });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await User.findOneAndDelete({ _id: id, role: "staff" });
    if (!staff) return res.status(404).json({ status: false, message: "Staff not found" });

    res.json({ status: true, message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
