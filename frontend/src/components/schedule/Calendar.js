import React from 'react';

const Calendar = ({ todos, selectedDate, onDateSelect }) => {
  const days = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i + 1;
    const isValidDay = dayNum <= 31;
    const dateStr = `2024-05-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
    const hasTodo = todos.some(t => t.date === dateStr);
    
    return { 
      day: isValidDay ? dayNum : '', 
      fullDate: isValidDay ? dateStr : null,
      hasTodo 
    };
  });

  return (
    <div className="calendar-wrapper">
      <div className="week-header">
        {['일','월','화','수','목','금','토'].map(d => <div key={d} className="week-day">{d}</div>)}
      </div>
      <div className="days-grid">
        {days.map((d, idx) => (
          <div 
            key={idx} 
            className={`day-cell ${d.fullDate === selectedDate ? 'selected' : ''}`}
            onClick={() => d.fullDate && onDateSelect(d.fullDate)}
          >
            <span className="day-num">{d.day}</span>
            {d.hasTodo && <div className="todo-marker"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;