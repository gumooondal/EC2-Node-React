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

// 날짜 형식 검증 함수
const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;

  const date = new Date(dateString);
  return date.toISOString().slice(0, 10) === dateString;
};

// 회수권 등록 라우트
router.post('/', authenticateToken, (req, res) => {
  const { gymName, ticketCount, registrationDate, expire } = req.body;
  const userPhoneNumber = req.user.phoneNumber;

  console.log('User phone number:', userPhoneNumber);
  console.log('Ticket data:', req.body);

  // 입력 유효성 검사
  if (!gymName || !ticketCount || !registrationDate || !expire) {
    return res.status(400).json({ success: false, message: '모든 필드를 채워주세요.' });
  }

  // 숫자로 변환
  const count = parseInt(ticketCount, 10);
  if (isNaN(count)) {
    return res.status(400).json({ success: false, message: '티켓 수량이 유효하지 않습니다.' });
  }

  // 등록일이 올바른 날짜 형식인지 확인
  if (!isValidDateFormat(registrationDate)) {
    return res.status(400).json({ success: false, message: '등록일이 올바른 형식이 아닙니다.' });
  }

  // 데이터베이스 쿼리
  const insertQuery = `
    INSERT INTO ticket (climbing_gym_name, ticket_count, registration_date, expire, user_phone_number)
    VALUES (?, ?, ?, ?, ?)
  `;

  // 쿼리 실행
  db.query(insertQuery, [gymName, count, registrationDate, expire, userPhoneNumber], (err, result) => {
    if (err) {
      console.error('Insert error:', err); // 자세한 에러 로그
      return res.status(500).json({ success: false, message: '회수권 등록 실패', error: err.message });
    }

    console.log('Insert result:', result);  
    return res.json({ success: true, message: '회수권이 등록되었습니다!' });
  });
});

module.exports = router;
