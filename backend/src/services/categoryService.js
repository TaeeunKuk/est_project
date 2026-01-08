// backend/src/services/categoryService.js
const Category = require("../models/categoryModel");

exports.createCategory = async (userId, name, color) => {
  // 중복 이름 체크
  const existing = await Category.findByName(userId, name);
  if (existing) {
    throw new Error("이미 존재하는 카테고리 이름입니다.");
  }

  // 색상이 없으면 기본값 설정 (DB default가 있지만 로직상 명시)
  const categoryColor = color || "#3182ce";

  return await Category.create(userId, name, categoryColor);
};

exports.getCategories = async (userId) => {
  return await Category.findAllByUserId(userId);
};

exports.updateCategory = async (id, userId, name, color) => {
  const category = await Category.update(id, userId, name, color);
  if (!category) {
    throw new Error("카테고리를 찾을 수 없거나 수정 권한이 없습니다.");
  }
  return category;
};

exports.deleteCategory = async (id, userId) => {
  const deletedCategory = await Category.delete(id, userId);
  if (!deletedCategory) {
    throw new Error("카테고리를 찾을 수 없거나 삭제 권한이 없습니다.");
  }
  return deletedCategory;
};
