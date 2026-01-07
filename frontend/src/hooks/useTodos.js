// src/hooks/useTodos.js
import { useState, useEffect, useCallback } from 'react';
import { todoService } from '../services/todoService';

const useTodos = (initialDate = null) => {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await todoService.getTodos(selectedDate);
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('투두 로드 실패:', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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
      throw err;
    }
  };

  const deleteTodo = async (id) => {
    if (!id) return;
    try {
      await todoService.deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      console.error('투두 삭제 실패:', err);
      throw err;
    }
  };

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
