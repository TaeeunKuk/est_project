// frontend/src/components/schedule/Calendar.jsx
import React, { useMemo } from "react";
import "../../assets/styles/components/_calendar.scss";

const getMonthMatrix = (year, month) => {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix = [];
  let dayCounter = 1;

  let week = new Array(7).fill(null);
  for (let i = startDay; i < 7; i++) {
    week[i] = dayCounter++;
  }
  matrix.push(week);

  while (dayCounter <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      week[i] = dayCounter++;
    }
    matrix.push(week);
  }

  return matrix;
};

const Calendar = ({ selectedDate, onSelectDate, todos = [] }) => {
  const safeTodos = Array.isArray(todos) ? todos : [];
  const date = selectedDate ? new Date(selectedDate) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  const matrix = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const todoDateSet = useMemo(() => {
    const s = new Set();
    for (const t of safeTodos) {
      if (t && t.date) s.add(String(t.date));
    }
    return s;
  }, [safeTodos]);

  return (
    <div className="calendar-wrapper">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <strong style={{ fontSize: "1.2rem" }}>
          {year}-{String(month + 1).padStart(2, "0")}
        </strong>
        <div>
          <button
            style={{
              marginRight: "8px",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              const prev = new Date(year, month - 1, 1);
              onSelectDate && onSelectDate(prev.toISOString().slice(0, 10));
            }}
          >
            ◀
          </button>
          <button
            style={{ border: "none", background: "none", cursor: "pointer" }}
            onClick={() => {
              const next = new Date(year, month + 1, 1);
              onSelectDate && onSelectDate(next.toISOString().slice(0, 10));
            }}
          >
            ▶
          </button>
        </div>
      </div>

      <div className="week-header">
        <div>일</div>
        <div>월</div>
        <div>화</div>
        <div>수</div>
        <div>목</div>
        <div>금</div>
        <div>토</div>
      </div>

      <div className="days-grid">
        {matrix.map((week, wi) =>
          (Array.isArray(week) ? week : new Array(7).fill(null)).map(
            (d, di) => {
              const cellDate = d
                ? new Date(year, month, d).toISOString().slice(0, 10)
                : null;
              const isSelected = cellDate === selectedDate;
              const hasTodo = cellDate ? todoDateSet.has(cellDate) : false;

              return (
                <div
                  key={`${wi}-${di}`}
                  className={`day-cell ${isSelected ? "selected" : ""}`}
                  onClick={() => d && onSelectDate && onSelectDate(cellDate)}
                >
                  <div>{d || ""}</div>
                  {hasTodo && <div className="todo-marker" />}
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
};

export default Calendar;
