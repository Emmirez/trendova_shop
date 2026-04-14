import express from 'express';
import {
  getLooks,
  getAllLooksForAdmin,
  updateLook,
  initializeLooks,
  createLook
} from '../controllers/lookController.js';
import { protect } from '../middleware/auth.js';
import { isAdminOrSuperAdmin } from '../middleware/roles.js';

const router = express.Router();

// Public routes
router.get('/', getLooks);

// Admin routes
router.get('/admin', protect, isAdminOrSuperAdmin, getAllLooksForAdmin);
router.put('/:id', protect, isAdminOrSuperAdmin, updateLook);
router.post('/initialize', protect, isAdminOrSuperAdmin, initializeLooks);
router.post('/', protect, isAdminOrSuperAdmin, createLook);

export default router;