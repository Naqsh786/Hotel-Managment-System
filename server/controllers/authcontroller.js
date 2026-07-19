import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/Sendemail.js";

// ==========================
// REGISTER
// ==========================
export const register = async (req, res) => {
  const { name, email, password, phoneNumber, address } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔢 OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log("🔐 OTP:", otp);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      verificationToken: otp,
      isVerified: false,
      otpExpires: Date.now() + 5 * 60 * 1000 // 5 min expiry
    });

    await sendEmail(email, otp, "verify");

    res.json({ status: true, message: "Registered! Check email OTP" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// VERIFY EMAIL (OTP)
// ==========================
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ status: false, message: "Already verified" });
    }

    if (user.verificationToken != otp) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ status: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.otpExpires = null;

    await user.save();

    res.json({ status: true, message: "Email Verified Successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// RESEND OTP
// ==========================
export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ status: false, message: "Already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.verificationToken = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("🔁 New OTP:", otp);

    await sendEmail(email, otp, "verify");

    res.json({ status: true, message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// LOGIN (JWT)
// ==========================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    if (!user.isVerified) {
      return res.status(400).json({ status: false, message: "Verify email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Wrong password" });
    }

    // 🔒 If ADMIN, require OTP on every login
    if (user.role === "admin") {
      const loginOtp = Math.floor(100000 + Math.random() * 900000);
      user.verificationToken = loginOtp;
      user.otpExpires = Date.now() + 5 * 60 * 1000;
      await user.save();

      console.log("👔 ADMIN LOGIN OTP:", loginOtp);
      await sendEmail(email, loginOtp, "verify"); // Using 'verify' template for simplicity or create a specific one

      return res.json({
        status: true,
        requireOtp: true,
        message: "Admin verification required. Check email for OTP",
        email: user.email
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      status: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// VERIFY LOGIN OTP (FOR ADMINS)
// ==========================
export const verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    if (user.verificationToken != otp) {
      return res.status(400).json({ status: false, message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ status: false, message: "OTP expired" });
    }

    // Clear OTP
    user.verificationToken = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      status: true,
      message: "Admin Login Successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// FORGOT PASSWORD
// ==========================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    await user.save();

    await sendEmail(email, token, "reset");

    res.json({ status: true, message: "Reset link sent" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// RESET PASSWORD
// ==========================
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ status: false, message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = null;

    await user.save();

    res.json({ status: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// GET ME (PROFILE)
// ==========================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res.json({ status: true, data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// UPDATE USER PROFILE
// ==========================
export const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address, cnic, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (cnic) user.cnic = cnic;
    if (profileImage) user.profileImage = profileImage;

    const updatedUser = await user.save();

    res.json({
      status: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        cnic: updatedUser.cnic,
        profileImage: updatedUser.profileImage,
        loyaltyPoints: updatedUser.loyaltyPoints
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// UPDATE PASSWORD
// ==========================
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ status: false, message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
