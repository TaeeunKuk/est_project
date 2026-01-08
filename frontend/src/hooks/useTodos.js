import { useState, useEffect, useCallback } from "react";
import * as todoService from "../services/todoService";

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. [READ] 모든 할 일 목록 불러오기
  const loadTodos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await todoService.fetchTodos();
      setTodos(data);
    } catch (err) {
      console.error("할 일 목록 로딩 실패:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // 2. [CREATE] 할 일 추가
  const addTodo = async (todoData) => {
    try {
      const newTodo = await todoService.createTodo(todoData);
      setTodos((prev) => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      console.error("할 일 추가 실패:", err);
    }
  };

  // 3. [UPDATE] 할 일 수정
  const updateTodo = async (id, updatedData) => {
    try {
      const updated = await todoService.updateTodo(id, updatedData);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("할 일 수정 실패:", err);
    }
  };

  // 4. [DELETE] 할 일 삭제 (window.confirm 제거됨)
  const deleteTodo = async (id) => {
    // TodoList 컴포넌트의 커스텀 모달에서 이미 확인을 거치므로 바로 삭제 로직 실행
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  // 5. [TOGGLE] 완료 상태 변경
  const toggleTodo = async (id) => {
    try {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_completed: !t.is_completed } : t
        )
      );
      await todoService.toggleTodoStatus(id);
    } catch (err) {
      console.error("완료 상태 변경 실패:", err);
      loadTodos();
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reload: loadTodos,
  };
};

export default useTodos;
