// frontend/src/hooks/useCategories.js
import { useState, useEffect, useCallback } from "react";
import categoryService from "../services/categoryService";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. 초기 데이터 로딩 (새로고침 시 데이터 유지의 핵심)
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      // API를 호출하여 DB에 저장된 카테고리를 가져옴
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("카테고리 로딩 실패:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트가 처음 렌더링될 때 fetchCategories 실행
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 2. 카테고리 생성
  const addCategory = async (name, color) => {
    try {
      const newCat = await categoryService.createCategory(name, color);
      setCategories((prev) => [...prev, newCat]);
      return true; // 성공 여부 반환
    } catch (err) {
      console.error(err);
      throw err; // UI에서 에러 처리를 위해 throw
    }
  };

  // 3. 카테고리 수정
  const updateCategory = async (id, name, color) => {
    try {
      const updatedCat = await categoryService.updateCategory(id, name, color);
      setCategories((prev) => prev.map((c) => (c.id === id ? updatedCat : c)));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // 4. 카테고리 삭제
  const deleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,
  };
};

export default useCategories;
