import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  addReply,
  updateStatus,
  deleteTicket,
  getTicketStats,
} from '../controllers/ticketController.js';
import { protect } from '../middleware/auth.js';
import { restrictTo, isAdminOrSuperAdmin } from '../middleware/roles.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .get(getTickets)  // Controller handles filtering based on role
  .post(createTicket);

// Stats route - admin & superadmin only
router.get('/admin/stats', isAdminOrSuperAdmin, getTicketStats);

// Individual ticket routes
router.route('/:id')
  .get(getTicketById)
  .delete(deleteTicket);

// Reply to ticket - accessible to all (controller checks permissions)
router.post('/:id/reply', addReply);

// Update status - admin & superadmin only
router.patch('/:id/status', isAdminOrSuperAdmin, updateStatus);

export default router;