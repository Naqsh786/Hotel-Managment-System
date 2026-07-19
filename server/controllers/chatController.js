import Chat from "../models/chat.js";
import User from "../models/user.js";

const getStaffIdsByRole = async (roleName) => {
  if (roleName === "admin") {
    const admins = await User.find({ role: "admin" });
    return admins.map(a => a._id);
  } else if (roleName === "manager") {
    const managers = await User.find({ role: "staff", responsibility: "Manager" });
    return managers.map(m => m._id);
  } else if (roleName === "receptionist") {
    const receptionists = await User.find({ role: "staff", responsibility: "Receptionist" });
    return receptionists.map(r => r._id);
  }
  return [];
};

const getMyStaffRole = (user) => {
  if (user.role === "admin") return "admin";
  if (user.responsibility === "Manager") return "manager";
  if (user.responsibility === "Receptionist") return "receptionist";
  return "staff"; // fallback
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { roleOrUserId } = req.params;

    let query;

    if (userRole === "user") {
      // User is guest, chatting with a role (admin/manager/receptionist)
      const staffIds = await getStaffIdsByRole(roleOrUserId.toLowerCase());
      query = {
        $or: [
          { sender: userId, receiverRole: roleOrUserId.toLowerCase() },
          { receiverId: userId, sender: { $in: staffIds } }
        ]
      };
    } else {
      // User is staff/admin, chatting with a guest
      const myRole = getMyStaffRole(req.user);
      query = {
        $or: [
          { sender: roleOrUserId, receiverRole: myRole }, // Guest to my role
          { sender: userId, receiverId: roleOrUserId } // Me to guest
        ]
      };
    }

    const messages = await Chat.find(query).populate("sender", "name profileImage role").sort("createdAt");
    res.json({ status: true, data: messages });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getActiveChats = async (req, res) => {
  try {
    const myRole = getMyStaffRole(req.user);
    const chats = await Chat.find({
      $or: [
        { receiverRole: myRole },
        { sender: req.user._id, receiverId: { $exists: true } }
      ]
    }).populate("sender", "name profileImage").populate("receiverId", "name profileImage").sort("-createdAt");
    
    const usersMap = new Map();
    for (let chat of chats) {
      const guestUser = chat.receiverRole === myRole ? chat.sender : chat.receiverId;
      if (!guestUser || usersMap.has(guestUser._id.toString())) continue;
      usersMap.set(guestUser._id.toString(), {
        user: guestUser,
        lastMessage: chat.message,
        timestamp: chat.createdAt,
        unread: !chat.read && chat.receiverRole === myRole
      });
    }

    res.json({ status: true, data: Array.from(usersMap.values()) });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverRole, receiverId, message } = req.body;
    const sender = req.user._id;

    const chat = new Chat({
      sender,
      receiverRole: receiverRole ? receiverRole.toLowerCase() : "guest",
      receiverId: receiverId || null,
      message
    });

    await chat.save();
    await chat.populate("sender", "name profileImage role");

    res.json({ status: true, data: chat });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const markRead = async (req, res) => {
  try {
    const { roleOrUserId } = req.body; // guest marks role messages as read, or staff marks user messages as read
    const userId = req.user._id;
    const userRole = req.user.role;

    let query;
    if (userRole === "user") {
      const staffIds = await getStaffIdsByRole(roleOrUserId.toLowerCase());
      query = { sender: { $in: staffIds }, receiverId: userId, read: false };
    } else {
      const myRole = getMyStaffRole(req.user);
      query = { sender: roleOrUserId, receiverRole: myRole, read: false };
    }

    await Chat.updateMany(query, { read: true });

    res.json({ status: true, message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
