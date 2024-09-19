const express = require('express');
const router = express.Router();
const db = require('../../../db'); // 데이터베이스 연결 불러오기
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

// 회수권 업데이트 라우트
router.patch('/:ticketId', authenticateToken, (req, res) => {
  const { ticketId } = req.params;
  const { ticketCount } = req.body;

  console.log(`Ticket ID: ${ticketId}를 업데이트 중...`);
  
  // 데이터베이스 쿼리
  const updateQuery = `
    UPDATE ticket
    SET ticket_count = ticket_count - ?
    WHERE id = ? AND ticket_count > 0;
  `;

  // 쿼리 실행
  db.query(updateQuery, [1, ticketId], (err, result) => { // ticketCount를 1로 설정
    if (err) {
      console.error('Update error:', err); // 자세한 에러 로그
      return res.status(500).json({ success: false, message: '티켓 업데이트 실패', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '해당 티켓을 찾을 수 없거나 차감할 수 없습니다.' });
    }

    // 티켓 수량이 0 이하일 때 삭제 쿼리 실행
    const deleteQuery = `
      DELETE FROM ticket
      WHERE id = ? AND ticket_count <= 0;
    `;

    db.query(deleteQuery, [ticketId], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('Delete error:', deleteErr);
        return res.status(500).json({ success: false, message: '티켓 삭제 실패', error: deleteErr.message });
      }

      console.log(`Ticket ID: ${ticketId}가 성공적으로 업데이트되었습니다.`);
      return res.json({ success: true, message: '티켓이 성공적으로 업데이트되었습니다.' });
    });
  });
});

module.exports = router;
