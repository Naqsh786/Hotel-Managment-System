import Food from '../models/food.js';

// @desc    Get all food items
// @route   GET /api/food
// @access  Public
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a food item
// @route   POST /api/food
// @access  Private/Admin
export const createFood = async (req, res) => {
  const { name, description, price, category, status, image } = req.body;

  try {
    const food = await Food.create({
      name,
      description,
      price,
      category,
      status,
      image
    });
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/food/:id
// @access  Private/Admin
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.status(200).json({ message: 'Food item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
