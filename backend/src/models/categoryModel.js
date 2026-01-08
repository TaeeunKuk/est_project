// backend/src/models/categoryModel.js
const pool = require("../config/db");

const Category = {
  // 1. 카테고리 생성
  create: async (userId, name, color) => {
    const query = `
      INSERT INTO categories (user_id, name, color)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, name, color]);
    return result.rows[0];
  },

  // 2. 사용자별 카테고리 전체 조회
  findAllByUserId: async (userId) => {
    const query = `
      SELECT * FROM categories 
      WHERE user_id = $1 
      ORDER BY created_at ASC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // 3. 카테고리 수정
  update: async (id, userId, name, color) => {
    const query = `
      UPDATE categories
      SET name = $1, color = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND user_id = $4
      RETURNING *;
    `;
    const result = await pool.query(query, [name, color, id, userId]);
    return result.rows[0];
  },

  // 4. 카테고리 삭제 (핵심: 연결된 Todo는 유지하되 category_id를 NULL로 변경)
  delete: async (id, userId) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // (1) 해당 카테고리를 참조하는 Todo들의 category_id를 NULL로 변경
      const updateTodosQuery = `
        UPDATE todos 
        SET category_id = NULL 
        WHERE category_id = $1 AND user_id = $2
      `;
      await client.query(updateTodosQuery, [id, userId]);

      // (2) 카테고리 삭제
      const deleteCategoryQuery = `
        DELETE FROM categories 
        WHERE id = $1 AND user_id = $2
        RETURNING *;
      `;
      const result = await client.query(deleteCategoryQuery, [id, userId]);

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // 중복 체크용
  findByName: async (userId, name) => {
    const query = `SELECT * FROM categories WHERE user_id = $1 AND name = $2`;
    const result = await pool.query(query, [userId, name]);
    return result.rows[0];
  },
};

module.exports = Category;
