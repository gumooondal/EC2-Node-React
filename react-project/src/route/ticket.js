const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../../db'); // 데이터베이스 연결 불러오기
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ success: false, message: '토큰이 없습니다.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: '유효하지 않은 토큰' });
    req.user = user;
    next();
  });
};

// 회수권 등록 라우트
router.post('/', authenticateToken, (req, res) => {
  const { climbingGymName, ticketCount, registrationDate } = req.body;
  const userPhoneNumber = req.user.phoneNumber; // JWT에서 가져온 사용자 정보

  console.log('User phone number:', userPhoneNumber);
  console.log('Request body:', req.body);

  if (!climbingGymName || !ticketCount || !registrationDate) {
    return res.status(400).json({ success: false, message: '모든 필드를 채워주세요.' });
  }

  // 데이터베이스 쿼리
  const insertQuery = `
    INSERT INTO ticket (climbing_gym_name, ticket_count, registration_date, user_phone_number)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertQuery, [climbingGymName, ticketCount, registrationDate, userPhoneNumber], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ success: false, message: '회수권 등록 실패' });
    }

    console.log('Insert result:', result);
    return res.json({ success: true, message: '회수권이 등록되었습니다!' });
  });
});

module.exports = router;

