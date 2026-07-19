import Message from '../models/message.js';

// ==========================
// PUBLIC (LOGGED-IN): SUBMIT MESSAGE
// ==========================
export const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const newMessage = await Message.create({
      user: req.user._id,
      name,
      email,
      subject,
      message
    });

    // Emit real-time event
    const io = req.app.get("io");
    if (io) {
      io.emit("newMessage", newMessage);
    }

    res.status(201).json({
      status: true,
      message: "Message sent successfully! We will contact you soon.",
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// ADMIN: GET MESSAGES (WITH PAGINATION & SEARCH)
// ==========================
export const getAdminMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    };

    const totalMessages = await Message.countDocuments(query);
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: true,
      data: messages,
      pagination: {
        total: totalMessages,
        page,
        pages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ==========================
// ADMIN: DELETE MESSAGE
// ==========================
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ status: false, message: "Message not found" });

    res.json({ status: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
