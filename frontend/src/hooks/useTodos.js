// frontend/src/hooks/useTodos.js
import { useState, useEffect, useCallback } from 'react';
import { todoService } from '../services/todoService';

/**
 * useTodos 훅
 * - selectedDate 기준으로 투두 목록을 불러오고 추가/삭제/토글 기능을 제공합니다.
 * - 반환값: { todos, loading, selectedDate, setSelectedDate, addTodo, deleteTodo, toggleTodo }
 *
 * @param {string|Date} initialDate 초기 선택 날짜 (optional)
 */
const useTodos = (initialDate = null) => {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);

  // 투두 목록을 서버에서 가져오는 함수
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      // todoService.getTodos는 selectedDate를 기준으로 목록을 반환한다고 가정
      const data = await todoService.getTodos(selectedDate);
      // 백엔드가 null 또는 객체를 반환할 수 있으므로 배열인지 확인
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('투두 로드 실패:', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  // selectedDate가 바뀌거나 훅이 마운트될 때 목록을 불러옴
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 투두 추가
  const addTodo = async (title, categoryId = null) => {
    if (!title || !String(title).trim()) return;
    try {
      await todoService.createTodo({
        title: String(title).trim(),
        categoryId: categoryId ?? null,
        date: selectedDate,
      });
      await fetchTodos();
    } catch (err) {
      console.error('투두 추가 실패:', err);
      // UI에서 처리할 수 있도록 예외를 던지거나 알림을 호출할 수 있음
      throw err;
    }
  };

  // 투두 삭제
  const deleteTodo = async (id) => {
    if (!id) return;
    try {
      // 확인은 호출자(UI)에서 처리하는 것이 일반적
      await todoService.deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      console.error('투두 삭제 실패:', err);
      throw err;
    }
  };

  // 완료 상태 토글
  const toggleTodo = async (id, currentStatus) => {
    if (!id) return;
    try {
      await todoService.updateTodo(id, { isCompleted: !currentStatus });
      await fetchTodos();
    } catch (err) {
      console.error('토글 실패:', err);
      throw err;
    }
  };

  return {
    todos,
    loading,
    selectedDate,
    setSelectedDate,
    addTodo,
    deleteTodo,
    toggleTodo,
  };
};

export default useTodos;
 