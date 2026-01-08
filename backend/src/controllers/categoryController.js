// backend/src/controllers/categoryController.js
const categoryService = require("../services/categoryService");

exports.createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    const userId = req.user.id; // 인증 미들웨어에서 설정된 사용자 ID

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "카테고리 이름을 입력해주세요." });
    }

    const newCategory = await categoryService.createCategory(
      userId,
      name,
      color
    );
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await categoryService.getCategories(userId);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const userId = req.user.id;

    const updatedCategory = await categoryService.updateCategory(
      id,
      userId,
      name,
      color
    );
    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await categoryService.deleteCategory(id, userId);
    res
      .status(200)
      .json({ success: true, message: "카테고리가 삭제되었습니다." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
