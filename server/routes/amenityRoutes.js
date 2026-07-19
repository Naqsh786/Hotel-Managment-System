import express from 'express';
import { getAllAmenities, createAmenity, updateAmenity, deleteAmenity } from '../controllers/amenityController.js';
import { protect, admin } from '../middleware/authmiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllAmenities)
  .post(protect, admin, createAmenity);

router.route('/:id')
  .put(protect, admin, updateAmenity)
  .delete(protect, admin, deleteAmenity);

export default router;
