// backend/src/services/todoService.js
const TodoModel = require("../models/todoModel");

exports.createTodo = async (userId, data) => {
  // data: { categoryId, title, description, date }
  return await TodoModel.create({ userId, ...data });
};

exports.getTodos = async (userId) => {
  return await TodoModel.findAllByUserId(userId);
};

exports.updateTodo = async (todoId, userId, data) => {
  const updatedTodo = await TodoModel.update(todoId, userId, data);
  if (!updatedTodo) {
    throw new Error("할 일을 찾을 수 없거나 수정 권한이 없습니다.");
  }
  return updatedTodo;
};

exports.toggleTodoStatus = async (todoId, userId) => {
  const updatedTodo = await TodoModel.toggleComplete(todoId, userId);
  if (!updatedTodo) {
    throw new Error("할 일을 찾을 수 없거나 권한이 없습니다.");
  }
  return updatedTodo;
};

exports.deleteTodo = async (todoId, userId) => {
  const deleted = await TodoModel.delete(todoId, userId);
  if (!deleted) {
    throw new Error("할 일을 찾을 수 없거나 삭제 권한이 없습니다.");
  }
  return deleted;
};
