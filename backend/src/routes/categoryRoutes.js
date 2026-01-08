// backend/src/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, categoryController.createCategory);
router.get("/", verifyToken, categoryController.getCategories);
router.put("/:id", verifyToken, categoryController.updateCategory);
router.delete("/:id", verifyToken, categoryController.deleteCategory);

module.exports = router;
