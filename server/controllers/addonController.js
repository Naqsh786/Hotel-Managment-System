import Addon from '../models/addon.js';

// @desc    Get all addons
// @route   GET /api/addons
// @access  Public
export const getAddons = async (req, res) => {
  try {
    const addons = await Addon.find();
    res.status(200).json({ status: true, data: addons });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// @desc    Create an addon
// @route   POST /api/addons
// @access  Admin
export const createAddon = async (req, res) => {
  try {
    const { name, price, icon, description } = req.body;
    const addon = await Addon.create({ name, price, icon, description });
    res.status(201).json({ status: true, message: "Add-on created successfully", data: addon });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

// @desc    Update an addon
// @route   PUT /api/addons/:id
// @access  Admin
export const updateAddon = async (req, res) => {
  try {
    const { name, price, icon, description } = req.body;
    const addon = await Addon.findByIdAndUpdate(
      req.params.id,
      { name, price, icon, description },
      { new: true, runValidators: true }
    );
    if (!addon) {
      return res.status(404).json({ status: false, message: 'Addon not found' });
    }
    res.status(200).json({ status: true, message: "Add-on updated successfully", data: addon });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

// @desc    Delete an addon
// @route   DELETE /api/addons/:id
// @access  Admin
export const deleteAddon = async (req, res) => {
  try {
    const addon = await Addon.findByIdAndDelete(req.params.id);
    if (!addon) {
      return res.status(404).json({ status: false, message: 'Addon not found' });
    }
    res.status(200).json({ status: true, message: 'Addon deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
