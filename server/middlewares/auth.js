import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ status: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ status: false, message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ status: false, message: "Not authorized as an admin" });
  }
};

export const managerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || (req.user.role === "staff" && req.user.responsibility === "Manager"))) {
    next();
  } else {
    res.status(401).json({ status: false, message: "Not authorized. Manager or Admin access required." });
  }
};

export const staffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "staff")) {
    next();
  } else {
    res.status(401).json({ status: false, message: "Not authorized. Staff or Admin access required." });
  }
};

export const softProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Do nothing, just continue without user
    }
  }
  next();
};

