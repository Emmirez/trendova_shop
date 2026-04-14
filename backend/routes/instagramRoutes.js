import express from 'express';
import {
  getInstagramFeed,
  getInstagramFeedForAdmin,
  addToInstagramFeed,
  updateInstagramFeedItem,
  removeFromInstagramFeed,
} from '../controllers/instagramController.js';
import { protect } from '../middleware/auth.js';
import { isAdminOrSuperAdmin } from '../middleware/roles.js';

const router = express.Router();

// Public routes
router.get('/', getInstagramFeed);

// Admin routes
router.get('/admin', protect, isAdminOrSuperAdmin, getInstagramFeedForAdmin);
router.post('/', protect, isAdminOrSuperAdmin, addToInstagramFeed);
router.put('/:id', protect, isAdminOrSuperAdmin, updateInstagramFeedItem);
router.delete('/:id', protect, isAdminOrSuperAdmin, removeFromInstagramFeed);

export default router;