// frontend/src/hooks/useTodos.js
import { useState, useEffect, useCallback } from "react";
import * as todoService from "../services/todoService"; // API 서비스 임포트

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. [READ] 모든 할 일 목록 불러오기
  const loadTodos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await todoService.fetchTodos();
      // DB에서 가져온 데이터는 snake_case일 수 있으므로 그대로 사용하거나 필요한 경우 여기서 매핑
      setTodos(data);
    } catch (err) {
      console.error("할 일 목록 로딩 실패:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 마운트 시 자동 실행
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
      alert("할 일을 저장하지 못했습니다.");
    }
  };

  // 3. [UPDATE] 할 일 수정 (내용, 날짜, 카테고리 등)
  const updateTodo = async (id, updatedData) => {
    try {
      // API 호출
      const updated = await todoService.updateTodo(id, updatedData);

      // 상태 업데이트
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("할 일 수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  // 4. [DELETE] 할 일 삭제
  const deleteTodo = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

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
      // 낙관적 업데이트 (UI 먼저 반영)
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_completed: !t.is_completed } : t
        )
      );

      // API 요청
      await todoService.toggleTodoStatus(id);

      // 필요시 정확성을 위해 다시 로드 (선택 사항)
      // loadTodos();
    } catch (err) {
      console.error("완료 상태 변경 실패:", err);
      // 에러 발생 시 원래대로 복구하려면 loadTodos() 호출
      loadTodos();
    }
  };

  return {
    todos, // 전체 리스트 (필터링은 컴포넌트에서 수행)
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
