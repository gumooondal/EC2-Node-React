// server/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../../../db'); // 데이터베이스 연결 설정을 가져옵니다

// 회원가입 요청 처리
router.post('/', async (req, res) => {
  const { phoneNumber, password } = req.body;
  console.log('회원가입 요청:', req.body);

  try {
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 정보를 데이터베이스에 삽입
    const query = 'INSERT INTO user (phone_number, password) VALUES (?, ?)';
    db.query(query, [phoneNumber, hashedPassword], (err, results) => {
      if (err) {
        console.error('회원가입 오류:', err);
        return res.status(500).json({ success: false, message: '회원가입 실패' });
      }

      res.json({ success: true, message: '회원가입 성공' });
    });
  } catch (err) {
    console.error('회원가입 중 오류 발생:', err);
    res.status(500).json({ success: false, message: '회원가입 실패' });
  }
});

module.exports = router;
