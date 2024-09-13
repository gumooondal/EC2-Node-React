// server/config.js

const mysql = require('mysql2');
require('dotenv').config(); // .env 파일을 로드

// 데이터베이스 연결 설정
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// 데이터베이스 연결 생성
const db = mysql.createConnection(dbConfig);

// 데이터베이스 연결
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    return;
  }
  console.log('Connected to the database at ' + new Date().toLocaleString());
});

module.exports = db; // db를 내보내어 다른 파일에서 사용할 수 있게 함
