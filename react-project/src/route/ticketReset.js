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

// 모든 티켓 초기화
router.delete('/', authenticateToken, (req, res) => {
    // 요청 본문에서 user_phone_number를 받습니다
    const userPhoneNumber = req.body.user_phone_number; 

    console.log('User Phone Number:', userPhoneNumber);

    //데이터베이스에서 userPhoneNumber에 해당하는 모든 티켓 삭제
    db.query('DELETE FROM ticket WHERE user_phone_number = ?', [userPhoneNumber], (error, results) => {
      if (error) {
        console.error('Failed to reset tickets:', error);
        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
      }

      res.status(204).send(); // 성공 시 응답
    });
});


module.exports = router;
