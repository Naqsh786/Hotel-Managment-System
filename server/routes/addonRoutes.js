import express from 'express';
import { getAddons, createAddon, updateAddon, deleteAddon } from '../controllers/addonController.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAddons);
router.post('/', protect, adminOnly, createAddon);
router.put('/:id', protect, adminOnly, updateAddon);
router.delete('/:id', protect, adminOnly, deleteAddon);

export default router;
