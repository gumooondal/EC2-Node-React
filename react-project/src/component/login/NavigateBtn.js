import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/LoginPage.css'; // 스타일 파일 연결
import axios from 'axios';

//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 로그 전송 함수
const logToServer = async (action) => {
  try {
    await axios.post(`/log`, { action });
  } catch (error) {
    console.error('서버 로그 기록 실패:', error);
  }
};

function NavigationOptions() {
  const navigate = useNavigate();

  const handleAdd = async () => {
    await logToServer('등록페이지로 이동');
    navigate('/ticket-add');
  };

  const handleList = async () => {
    await logToServer('리스트페이지로 이동');
    navigate('/ticket-list');
  };

  return (
    <div className="navigation-options">
      <p>비로그인 이용 - 기기 변경시 모든 데이터가 초기화됩니다.</p>
      <button className="navigation-button" onClick={handleAdd}>
        회수권 등록하기
      </button>
      <button className="navigation-button" onClick={handleList}>
        회수권 보기
      </button>
    </div>
  );
}

export default NavigationOptions;
