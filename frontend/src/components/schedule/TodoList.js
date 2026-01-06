import React, { useState } from 'react';

const TodoList = ({ 
  todos, 
  categories, 
  onAdd, 
  onToggle, 
  onDelete, 
  onUpdate,
  onGoToday, // [NEW] 오늘 날짜로 이동하는 함수
  filterType, 
  setFilterType,
  selectedDate // 현재 선택된 날짜 (표시용)
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || 1);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAdd(inputText, selectedCat);
    setInputText('');
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const saveEdit = (id) => {
    if (editText.trim()) onUpdate(id, editText);
    setEditingId(null);
  };

  const getCategoryColor = (id) => {
    const cat = categories.find(c => c.id === Number(id));
    return cat ? cat.color : '#ccc';
  };

  return (
    <div className="todo-wrapper">
      {/* 필터 탭: 오늘 / 선택한 날짜 / 이번 주 */}
      <div className="filter-tabs">
        <button className="btn-today" onClick={onGoToday}>오늘 (Today)</button>
        
        <button 
          className={filterType === 'daily' ? 'active' : ''} 
          onClick={() => setFilterType('daily')}
        >
          {selectedDate} (선택됨)
        </button>
        
        <button 
          className={filterType === 'weekly' ? 'active' : ''} 
          onClick={() => setFilterType('weekly')}
        >
          이번 주 (Weekly)
        </button>
      </div>

      {filterType === 'daily' && (
        <form onSubmit={handleSubmit} className="input-group">
          <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="cat-select">
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
          </select>
          <input 
            type="text" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            placeholder="할 일 입력" 
            className="todo-input"
          />
          <button type="submit" className="btn-primary">등록</button>
        </form>
      )}

      <ul className="list-container">
        {todos.length === 0 ? (
          <li className="empty-msg">
            {filterType === 'daily' ? '이 날의 일정이 없습니다.' : '이번 주 일정이 없습니다.'}
          </li>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <div className="left-section">
                {/* 완료 체크박스 */}
                <input 
                  type="checkbox" 
                  checked={todo.isCompleted} 
                  onChange={() => onToggle(todo.id)} 
                />
                
                {editingId === todo.id ? (
                  <input 
                    type="text" 
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(todo.id)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="cat-dot" style={{ backgroundColor: getCategoryColor(todo.categoryId) }}></span>
                    <span className={`todo-text ${todo.isCompleted ? 'text-done' : ''}`}>
                      {todo.title}
                      {filterType === 'weekly' && <small style={{marginLeft: '8px', color:'#aaa'}}>({todo.date})</small>}
                    </span>
                  </>
                )}
              </div>

              <div className="btn-group">
                {editingId === todo.id ? (
                  <button onClick={() => saveEdit(todo.id)} className="btn-save">저장</button>
                ) : (
                  <button onClick={() => startEditing(todo)} className="btn-edit">수정</button>
                )}
                <button onClick={() => onDelete(todo.id)} className="btn-del">삭제</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TodoList;