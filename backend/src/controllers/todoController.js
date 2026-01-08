// backend/src/controllers/todoController.js
const todoService = require("../services/todoService");

exports.createTodo = async (req, res) => {
  try {
    const userId = req.user.id; // verifyToken 미들웨어에서 설정됨
    const { categoryId, title, description, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "제목과 날짜는 필수입니다." });
    }

    const newTodo = await todoService.createTodo(userId, {
      categoryId: categoryId || null, // 빈 값이면 null 처리
      title,
      description,
      date,
    });

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러: 할 일 생성 실패" });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const todos = await todoService.getTodos(userId);
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러: 목록 조회 실패" });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { categoryId, title, description, date } = req.body;

    const updatedTodo = await todoService.updateTodo(id, userId, {
      categoryId: categoryId || null,
      title,
      description,
      date,
    });

    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.toggleTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updatedTodo = await todoService.toggleTodoStatus(id, userId);
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await todoService.deleteTodo(id, userId);
    res.json({ message: "삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
