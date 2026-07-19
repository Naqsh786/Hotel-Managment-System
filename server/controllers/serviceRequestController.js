import ServiceRequest from "../models/serviceRequest.js";

// @desc    Create new service request
// @route   POST /api/service-requests
// @access  Private
export const createServiceRequest = async (req, res) => {
  try {
    const { room, booking, type, notes, items, totalAmount } = req.body;
    
    const newRequest = new ServiceRequest({
      user: req.user.id,
      room,
      booking,
      type,
      notes,
      items,
      totalAmount
    });

    const savedRequest = await newRequest.save();

    // Emit real-time event
    const io = req.app.get("io");
    if (io) {
      io.emit("newServiceRequest", savedRequest);
    }

    res.status(201).json({ success: true, data: savedRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get my service requests
// @route   GET /api/service-requests/me
// @access  Private
export const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user.id })
      .populate("room", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all service requests (Admin/Staff)
// @route   GET /api/service-requests/admin
// @access  Private
export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("user", "name roomNumber")
      .populate("room", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service request status
// @route   PATCH /api/service-requests/:id
// @access  Private
export const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
    );
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Emit real-time event
    const io = req.app.get("io");
    if (io) {
      io.emit("serviceStatusUpdate", request);
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
