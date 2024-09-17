const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../../db'); // 데이터베이스 연결 불러오기
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/', (req, res) => {
  const { phoneNumber, password } = req.body;

  const query = 'SELECT * FROM user WHERE phone_number = ?';

  db.query(query, [phoneNumber], async (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }

    if (results.length > 0) {
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ phoneNumber: user.phone_number }, JWT_SECRET, { expiresIn: '1h' });
        console.log(`로그 : 로그인 성공 - ${new Date().toLocaleString(), token}`);
        return res.json({ success: true, message: '로그인 성공', token });
      } else {
        return res.status(401).json({ success: false, message: '로그인 실패: 잘못된 비밀번호' });
      }
    } else {
      return res.status(401).json({ success: false, message: '로그인 실패: 사용자 없음' });
    }
  });
});

module.exports = router;
