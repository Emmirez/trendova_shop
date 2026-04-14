import express from "express";
import { protect } from "../middleware/auth.js";
import { isAdminOrSuperAdmin } from "../middleware/roles.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, isAdminOrSuperAdmin, createProduct);
router.put("/:id", protect, isAdminOrSuperAdmin, updateProduct);
router.delete("/:id", protect, isAdminOrSuperAdmin, deleteProduct);

export default router;
