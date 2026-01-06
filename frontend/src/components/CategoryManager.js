import React, { useState } from 'react';

const CategoryManager = ({ categories = [], onAddCategory, onDeleteCategory }) => {
  const [newCatName, setNewCatName] = useState('');

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    onAddCategory(newCatName);
    setNewCatName('');
  };

  return (
    <div className="category-manager">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>카테고리 관리</h3>
      <div className="input-group" style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <input 
          type="text" 
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          placeholder="새 카테고리" 
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
        />
        <button onClick={handleAdd} className="btn-primary">추가</button>
      </div>
      <div className="cat-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {categories.map(cat => (
          <span key={cat.id} className="cat-chip" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#edf2f7', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: cat.color, borderRadius: '50%', marginRight: '6px' }}></span>
            {cat.title}
            <button onClick={() => onDeleteCategory(cat.id)} style={{ marginLeft: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#a0aec0' }}>&times;</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;