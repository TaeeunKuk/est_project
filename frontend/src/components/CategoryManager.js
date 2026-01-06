import React, { useState } from 'react';

const CategoryManager = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newCatName, setNewCatName] = useState('');

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    onAddCategory(newCatName);
    setNewCatName('');
  };

  return (
    <div className="category-manager">
      <h3>카테고리 관리</h3>
      <div className="cat-input-group">
        <input 
          type="text" 
          placeholder="새 카테고리 추가" 
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
        />
        <button className="btn-primary" onClick={handleAdd}>추가</button>
      </div>
      <ul className="cat-list">
        {categories.map(cat => (
          <li key={cat.id} className="cat-chip">
            <span className="color-dot" style={{backgroundColor: cat.color}}></span>
            {cat.title}
            <button className="btn-del-cat" onClick={() => onDeleteCategory(cat.id)}>&times;</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;