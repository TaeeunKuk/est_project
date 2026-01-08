// backend/src/routes/todoRoutes.js
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, todoController.createTodo); // 생성
router.get("/", verifyToken, todoController.getTodos); // 조회
router.put("/:id", verifyToken, todoController.updateTodo); // 수정 (내용, 카테고리 등)
router.patch("/:id/complete", verifyToken, todoController.toggleTodo); // 완료 상태 토글
router.delete("/:id", verifyToken, todoController.deleteTodo); // 삭제

module.exports = router;
