import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api';

// 컴포넌트 불러오기 (경로를 본인의 환경에 맞게 확인하세요)
import Calendar from '../components/schedule/Calendar';
import TodoList from '../components/schedule/TodoList';
import CategoryManager from '../components/CategoryManager';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  // --- 상태 관리 ---
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, title: '업무', color: '#4299e1' },
    { id: 2, title: '개인', color: '#48bb78' },
    { id: 3, title: '긴급', color: '#e53e3e' }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('daily'); // daily 또는 weekly

  // --- 데이터 로딩 (READ) ---
  const fetchTodos = useCallback(async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // --- 일정 조작 함수들 (CUD) ---
  
  // 1. 추가
  const handleAddTodo = async (title, categoryId) => {
    try {
      await createTodo({ title, categoryId, date: selectedDate });
      fetchTodos();
    } catch (err) { alert('추가 중 오류가 발생했습니다.'); }
  };

  // 2. 토큰/완료 상태 변경
  const handleToggleTodo = async (id) => {
    const target = todos.find(t => t.id === id);
    if (!target) return;
    try {
      await updateTodo(id, { isCompleted: !target.isCompleted });
      fetchTodos();
    } catch (err) { console.error('수정 실패:', err); }
  };

  // 3. 내용 수정
  const handleUpdateText = async (id, newTitle) => {
    try {
      await updateTodo(id, { title: newTitle });
      fetchTodos();
    } catch (err) { console.error('내용 수정 실패:', err); }
  };

  // 4. 삭제
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (err) { console.error('삭제 실패:', err); }
  };

  // 5. 오늘 날짜로 이동 (TodoList의 onGoToday 연결)
  const handleGoToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setFilterType('daily');
  };

  // --- 필터링 로직 ---
  const filteredTodos = todos.filter(todo => {
    if (filterType === 'daily') {
      return todo.date === selectedDate;
    } else {
      // 간단한 주간 필터 (실제 구현 시 현재 주의 시작~끝 계산 로직 추가 권장)
      return true; // 주간 보기 시 전체 출력 혹은 로직 적용
    }
  });

  return (
    <div className="dashboard-container">
      {/* 좌측 사이드바 영역 */}
      <aside className="sidebar">
        <CategoryManager 
          categories={categories}
          onAddCategory={(name) => setCategories([...categories, { id: Date.now(), title: name, color: '#a0aec0' }])}
          onDeleteCategory={(id) => setCategories(categories.filter(c => c.id !== id))}
        />
        
        <div className="calendar-section">
          <Calendar 
            todos={todos} 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
          />
        </div>
      </aside>

      {/* 우측 메인 콘텐츠 영역 */}
      <main className="main-content">
        <header className="main-header">
          <div className="user-info">
            <h2>{selectedDate} 일정 관리</h2>
            <p>안녕하세요, <strong>{user?.name || '사용자'}</strong>님! 오늘도 화이팅하세요.</p>
          </div>
          <button onClick={logout} className="btn-logout">로그아웃</button>
        </header>

        <section className="todo-card">
          <TodoList 
            todos={filteredTodos}
            categories={categories}
            onAdd={handleAddTodo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateText}
            onGoToday={handleGoToday}
            filterType={filterType}
            setFilterType={setFilterType}
            selectedDate={selectedDate}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;