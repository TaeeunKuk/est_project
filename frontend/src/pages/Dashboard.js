// src/pages/Dashboard.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CategoryManager from '../components/CategoryManager';
import TodoList from '../components/schedule/TodoList';
import Calendar from '../components/schedule/Calendar';
import { mockTodos, mockCategories } from '../api/mockData';
import '../assets/styles/main.scss';

const Dashboard = () => {
  // --- Context: 로그인 유저 정보 및 로그아웃 함수 가져오기 ---
  const { user, logout } = useContext(AuthContext);

  // --- State Management ---
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // 날짜 및 뷰 상태
  // 기본값: 오늘 날짜 (YYYY-MM-DD 형식)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('daily'); // 'daily' | 'weekly'

  // --- Initial Data Load ---
  useEffect(() => {
    /* TODO: [Backend Integration] 
      1. GET /api/todos (Redis 세션/JWT 토큰으로 유저 식별)
      2. GET /api/categories
      
      DB 연결 전이므로 더미 데이터 사용
    */
    setTodos(mockTodos);
    setCategories(mockCategories);
  }, []);

  // --- Helper: 주간 날짜 계산 로직 ---
  const getWeekDates = (dateStr) => {
    const curr = new Date(dateStr);
    const day = curr.getDay(); // 0(일) ~ 6(토)
    const diff = curr.getDate() - day; 
    const sunday = new Date(curr.setDate(diff));
    
    let week = [];
    for (let i = 0; i < 7; i++) {
      let d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      week.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
    }
    return week;
  };

  // --- Logic: Todo 필터링 (일간/주간) ---
  const getFilteredTodos = () => {
    if (filterType === 'daily') {
      return todos.filter(t => t.date === selectedDate);
    } else {
      // Weekly Filter
      const weekDates = getWeekDates(selectedDate);
      return todos.filter(t => weekDates.includes(t.date));
    }
  };

  // --- Handler: 오늘 날짜로 이동 ---
  const handleGoToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setFilterType('daily');
  };

  // --- Handlers: Todo CRUD ---

  // 1. 할 일 등록
  const handleAddTodo = (text, categoryId) => {
    const newTodo = {
      id: Date.now(), // 임시 ID
      title: text,
      date: selectedDate, // 현재 선택된 날짜에 등록
      isCompleted: false,
      categoryId: Number(categoryId)
    };

    /* TODO: [POST] /api/todos
      Body: { title: text, date: selectedDate, categoryId }
    */
    setTodos([...todos, newTodo]);
  };

  // 2. 할 일 수정
  const handleUpdateTodo = (id, newText) => {
    /* TODO: [PATCH] /api/todos/:id
      Body: { title: newText }
    */
    setTodos(todos.map(t => t.id === id ? { ...t, title: newText } : t));
  };

  // 3. 할 일 완료/미완료 토글
  const handleToggleTodo = (id) => {
    /* TODO: [PATCH] /api/todos/:id/status
      Body: { isCompleted: !currentStatus }
    */
    setTodos(todos.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

  // 4. 할 일 삭제
  const handleDeleteTodo = (id) => {
    /* TODO: [DELETE] /api/todos/:id
    */
    setTodos(todos.filter(t => t.id !== id));
  };

  // --- Handlers: Category CRUD ---

  // 1. 카테고리 추가
  const handleAddCategory = (name) => {
    const newCat = {
      id: Date.now(),
      title: name,
      // 랜덤 색상 생성 (Hex Code)
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    /* TODO: [POST] /api/categories
      Body: { title: name, color: ... }
    */
    setCategories([...categories, newCat]);
  };

  // 2. 카테고리 삭제
  const handleDeleteCategory = (id) => {
    /* TODO: [DELETE] /api/categories/:id
      DB 설계 시 ON DELETE SET NULL로 설정했으므로,
      프론트에서도 해당 카테고리를 가진 Todo의 categoryId를 null로 바꾸거나,
      단순히 카테고리 목록에서만 제거하고 재조회할 수 있음.
    */
    setCategories(categories.filter(c => c.id !== id));
  };

  // --- Render ---
  return (
    <div className="dashboard-container">
      {/* --- 좌측 사이드바: 카테고리 관리 & 달력 --- */}
      <aside className="sidebar">
        <CategoryManager 
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
        
        {/* 달력: 날짜 선택 시 해당 날짜의 일간 뷰로 전환 */}
        <Calendar 
          todos={todos}
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setFilterType('daily');
          }}
        />
      </aside>

      {/* --- 우측 메인 컨텐츠: 헤더 & 투두 리스트 --- */}
      <main className="main-content">
        <header>
          <div>
            <h2>{selectedDate} 일정</h2>
            {/* 로그인 유저 이름 표시 */}
            <p style={{ color: '#718096', fontSize: '0.9rem', marginTop: '4px' }}>
              안녕하세요, <strong>{user?.name}</strong>님! 
              ({filterType === 'daily' ? '일간 보기' : '주간 보기'})
            </p>
          </div>

          {/* 로그아웃 버튼 */}
          <button 
            onClick={logout} 
            className="btn-primary" 
            style={{ backgroundColor: '#e53e3e', fontSize: '0.85rem' }}
          >
            로그아웃
          </button>
        </header>

        <TodoList 
          todos={getFilteredTodos()}       // 필터링된 목록 전달
          categories={categories}          // 카테고리 목록 전달
          selectedDate={selectedDate}      // 현재 선택된 날짜
          
          // 핸들러 전달
          onAdd={handleAddTodo}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
          onGoToday={handleGoToToday}
          
          // 뷰 상태 제어 전달
          filterType={filterType}
          setFilterType={setFilterType}
        />
      </main>
    </div>
  );
};

export default Dashboard;