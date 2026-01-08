// backend/src/models/todoModel.js
const pool = require("../config/db");

const TodoModel = {
  // 1. 할 일 생성
  create: async ({ userId, categoryId, title, description, date }) => {
    // 들어오는 date는 "YYYY-MM-DD" 문자열로 가정
    const query = `
      INSERT INTO todos (user_id, category_id, title, description, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *, to_char(date, 'YYYY-MM-DD') as date; 
    `;
    // RETURNING에 to_char를 추가하여 생성 직후 반환되는 데이터도 문자열로 고정

    const values = [userId, categoryId, title, description, date];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // 2. 내 할 일 전체 조회
  findAllByUserId: async (userId) => {
    // [핵심] t.date를 그대로 가져오면 JS Date 객체가 되어버림 -> to_char로 문자열 변환
    const query = `
      SELECT 
        t.id, t.user_id, t.category_id, t.title, t.description, t.is_completed, t.created_at, t.updated_at,
        to_char(t.date, 'YYYY-MM-DD') as date,
        c.name as category_name, c.color as category_color
      FROM todos t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
      ORDER BY t.date ASC, t.created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  // 3. 할 일 수정
  update: async (todoId, userId, { categoryId, title, description, date }) => {
    const query = `
      UPDATE todos
      SET category_id = $1, title = $2, description = $3, date = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND user_id = $6
      RETURNING *, to_char(date, 'YYYY-MM-DD') as date;
    `;
    const values = [categoryId, title, description, date, todoId, userId];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // 4. 완료 상태 토글
  toggleComplete: async (todoId, userId) => {
    const query = `
      UPDATE todos
      SET is_completed = NOT is_completed, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *, to_char(date, 'YYYY-MM-DD') as date;
    `;
    const { rows } = await pool.query(query, [todoId, userId]);
    return rows[0];
  },

  // 5. 할 일 삭제
  delete: async (todoId, userId) => {
    const query = `
      DELETE FROM todos
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const { rows } = await pool.query(query, [todoId, userId]);
    return rows[0];
  },
};

module.exports = TodoModel;
