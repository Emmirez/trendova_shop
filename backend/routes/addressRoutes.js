import express from 'express';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController.js';
import { protect } from '../middleware/auth.js';


const router = express.Router();

// All routes require authentication only (not admin)
router.use(protect);

router.route('/')
  .get(getAddresses)
  .post(addAddress);

router.route('/:addressId')
  .put(updateAddress)
  .delete(deleteAddress);

router.patch('/:addressId/default', setDefaultAddress);

export default router;