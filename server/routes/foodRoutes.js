import express from 'express';
import { getFoods, createFood, updateFood, deleteFood } from '../controllers/foodController.js';
import { protect, managerOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getFoods)
  .post(protect, managerOrAdmin, createFood);

router.route('/:id')
  .put(protect, managerOrAdmin, updateFood)
  .delete(protect, managerOrAdmin, deleteFood);

export default router;
