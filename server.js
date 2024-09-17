const express = require('express');
const cors = require('cors'); // CORS 미들웨어 import
const path = require('path');
const app = express();
const db = require('./db'); // DB 모듈 import
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: '*', // 모든 도메인에서 요청을 허용
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // 허용할 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
  }));
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true }));


// 기본 라우트 설정
app.get('/', (req, res) => {
    res.send('Hello, world!');
});


const ticketAddRoutes = require(path.join(__dirname, 'react-project/src/route/ticketAdd'));
const ticketListRoutes = require(path.join(__dirname, 'react-project/src/route/ticketList'));
const registerRoutes = require(path.join(__dirname, 'react-project/src/route/register'));
const loginRoutes = require(path.join(__dirname, 'react-project/src/route/login'));
const updateRoutes = require(path.join(__dirname, 'react-project/src/route/ticketUpdate'));
const deleteRoutes = require(path.join(__dirname, 'react-project/src/route/ticketDelete'));


app.use('/api/ticket-add', ticketAddRoutes);
app.use('/api/ticket-list', ticketListRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/ticket-update', updateRoutes);
app.use('/api/ticket-delete', deleteRoutes);

app.post('/api/logout', (req, res) => {
    const token = req.headers.authorization;
  
    // 서버 콘솔에 로그 남기기
    console.log(`로그 : 로그아웃 성공 - ${new Date().toLocaleString()}`);
  
    // 로그아웃 처리 후 응답
    res.status(200).json({ message: '로그아웃 성공' });
  });
  

app.post('/log', (req, res) => {
    const { action } = req.body;
    console.log('클라이언트 로그:', action); // 콘솔에 로그 기록
    res.status(200).send('로그 기록 완료');
});


// 서버 시작
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
});
