// backend/index.js
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); 
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 라우트 등록
app.use('/api/users', userRoutes);

// DB 테스트 API
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'DB 연결 성공!', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});