import express from "express";
import { protect } from "../middleware/auth.js";
import { isSuperAdmin } from "../middleware/roles.js";
import {
  getAllUsers,
  getUserById,
  updateProfile,
  changePassword,
  promoteToAdmin,
  demoteToUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Logged in user routes
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// Superadmin only routes
router.get("/", protect, isSuperAdmin, getAllUsers);
router.get("/:id", protect, isSuperAdmin, getUserById);
router.patch("/:id/promote", protect, isSuperAdmin, promoteToAdmin);
router.patch("/:id/demote", protect, isSuperAdmin, demoteToUser);
router.delete("/:id", protect, isSuperAdmin, deleteUser);

export default router;
