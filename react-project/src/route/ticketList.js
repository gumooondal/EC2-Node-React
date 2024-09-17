const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../../db'); // 데이터베이스 연결 불러오기
require('dotenv').config();

const router = express.Router(); // router 정의

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ success: false, message: '토큰이 없습니다.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: '유효하지 않은 토큰' });
    req.user = user;
    next();
  });
};

// 티켓 데이터 조회 라우트
router.get('/', authenticateToken, (req, res) => {
  const startTime = Date.now();
  const userPhoneNumber = req.user.phoneNumber; // JWT에서 가져온 사용자 정보

  // 데이터베이스 쿼리
  const query = 'SELECT * FROM ticket WHERE user_phone_number = ?'; // 사용자의 티켓만 가져오는 쿼리

  db.query(query, [userPhoneNumber], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
    const endTime = Date.now();
    console.log(`Fetched ${results.length} tickets for user ${userPhoneNumber} in ${endTime - startTime}ms`);

    // 성공 응답 반환
    res.json({ 
      success: true, 
      tickets: results, 
      userPhoneNumber: userPhoneNumber });
  });
});

module.exports = router;
