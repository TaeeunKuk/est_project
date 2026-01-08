import { useState, useEffect } from "react";
import { format } from "date-fns";

// 초기 더미 데이터 생성 함수 (현재 날짜 기준)
const getInitialTodos = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  return [
    {
      id: 1,
      title: "팀 회의 자료 준비하기",
      isCompleted: false,
      date: today,
      categoryId: 1, // 업무
    },
    {
      id: 2,
      title: "점심 약속 (강남역)",
      isCompleted: true,
      date: today,
      categoryId: 2, // 개인
    },
    {
      id: 3,
      title: "운동 가기 (헬스장)",
      isCompleted: false,
      date: today,
      categoryId: 2, // 개인
    },
    {
      id: 4,
      title: "프로젝트 기획안 마감",
      isCompleted: false,
      date: today,
      categoryId: 3, // 긴급
    },
  ];
};

const useTodos = (selectedDateStr) => {
  // 전체 투두 리스트 상태 관리
  const [allTodos, setAllTodos] = useState(getInitialTodos());
  const [loading, setLoading] = useState(false);

  // 1. [CREATE] 할 일 추가
  const addTodo = (title, categoryId) => {
    const newTodo = {
      id: Date.now(), // 고유 ID 생성
      title,
      isCompleted: false,
      date: selectedDateStr, // 현재 선택된 날짜에 추가
      categoryId,
    };
    setAllTodos((prev) => [...prev, newTodo]);
  };

  // 2. [UPDATE] 할 일 수정 (내용 변경)
  const updateTodo = (id, newTitle) => {
    setAllTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo))
    );
  };

  // 3. [DELETE] 할 일 삭제
  const deleteTodo = (id) => {
    if (window.confirm("이 할 일을 삭제하시겠습니까?")) {
      setAllTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  // 4. [TOGGLE] 완료/미완료 상태 변경
  const toggleTodo = (id) => {
    setAllTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  // 선택된 날짜에 해당하는 투두만 필터링해서 반환
  // 실제 API 연동 시에는 여기서 useEffect로 fetch를 수행합니다.
  const filteredTodos = allTodos.filter(
    (todo) => todo.date === selectedDateStr
  );

  return {
    todos: filteredTodos, // 필터링된 리스트 반환
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
};

export default useTodos;
