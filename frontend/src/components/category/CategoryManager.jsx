// frontend/src/components/category/CategoryManager.jsx
import React, { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiAlertCircle, // 아이콘 추가
} from "react-icons/fi";

const CategoryManager = ({ categories, onAdd, onUpdate, onDelete }) => {
  const [inputName, setInputName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3182ce");
  const [editModeId, setEditModeId] = useState(null);

  // 모달 상태 관리
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const colorPalette = [
    "#3182ce",
    "#38a169",
    "#e53e3e",
    "#d69e2e",
    "#805ad5",
    "#d53f8c",
    "#718096",
    "#319795",
    "#dd6b20",
  ];

  const handleAddOrUpdate = async () => {
    if (!inputName.trim()) return;

    try {
      if (editModeId) {
        await onUpdate(editModeId, inputName.trim(), selectedColor);
        setEditModeId(null);
      } else {
        await onAdd(inputName.trim(), selectedColor);
      }
      setInputName("");
      setSelectedColor(colorPalette[0]);
    } catch (error) {
      setAlertMsg(
        error.response?.data?.message || "작업 중 오류가 발생했습니다."
      );
    }
  };

  const handleDeleteRequest = (id) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch (error) {
      setDeleteConfirmId(null);
      setAlertMsg("삭제 중 오류가 발생했습니다.");
    }
  };

  const startEdit = (cat) => {
    setEditModeId(cat.id);
    setInputName(cat.name);
    setSelectedColor(cat.color);
  };

  return (
    <div className="category-manager-modal">
      {/* 1. 입력 영역 */}
      <div className="input-row">
        <input
          className="cat-input"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder={editModeId ? "카테고리 수정" : "새 카테고리 명 입력"}
          onKeyPress={(e) => e.key === "Enter" && handleAddOrUpdate()}
        />
        <button className="btn-save" onClick={handleAddOrUpdate}>
          {editModeId ? "수정" : <FiPlus />}
        </button>
      </div>

      {/* 2. 컬러 피커 영역 */}
      <div className="color-picker-row">
        <span className="label">색상 선택</span>
        <div className="palette">
          {colorPalette.map((color) => (
            <div
              key={color}
              className={`color-circle ${
                selectedColor === color ? "selected" : ""
              }`}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && <FiCheck color="white" size={14} />}
            </div>
          ))}
        </div>
      </div>

      {/* 3. 리스트 영역 */}
      <ul className="cat-list">
        {categories.map((cat) => (
          <li key={cat.id} className="cat-item">
            <div className="cat-info">
              <span
                className="color-dot"
                style={{ backgroundColor: cat.color }}
              />
              <span className="cat-text">{cat.name}</span>
            </div>
            <div className="cat-actions">
              <button onClick={() => startEdit(cat)} title="수정">
                <FiEdit2 size={16} />
              </button>
              <button
                className="danger"
                onClick={() => handleDeleteRequest(cat.id)}
                title="삭제"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* --- 내부 오버레이 (Absolute Positioned) --- */}

      {/* 삭제 확인 창 */}
      {deleteConfirmId && (
        <div className="mini-modal-overlay">
          <div className="mini-modal">
            <div className="icon-area">
              <FiAlertCircle />
            </div>
            <h3>카테고리 삭제</h3>
            <p>정말로 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirmId(null)}
              >
                취소
              </button>
              <button className="btn-confirm" onClick={executeDelete}>
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 알림/오류 메시지 창 */}
      {alertMsg && (
        <div className="mini-modal-overlay">
          <div className="mini-modal">
            <div className="icon-area">
              <FiAlertCircle />
            </div>
            <h3>알림</h3>
            <p>{alertMsg}</p>
            <div className="modal-actions">
              <button
                className="btn-confirm"
                style={{ width: "100%" }}
                onClick={() => setAlertMsg(null)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
