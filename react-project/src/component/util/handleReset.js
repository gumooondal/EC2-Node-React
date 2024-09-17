import axios from 'axios';

export const handleReset = async (isLoggedIn, userPhoneNumber, setTickets) => {
  const isConfirmed = window.confirm('정말 모든 티켓을 초기화하시겠습니까?');

  if (isConfirmed) {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:3010/ticket-reset', {
          headers: { Authorization: `Bearer ${token}` },
          data: { user_phone_number: userPhoneNumber } // 요청 본문에 user_phone_number 추가
        });
        // 서버에서 성공적으로 초기화된 경우, 로컬 상태에서 티켓 초기화
        setTickets([]);
      } catch (error) {
        console.error('Failed to reset tickets from server:', error);
      }
    } else {
      // 비로그인 상태에서 로컬 스토리지에서 모든 티켓 제거
      localStorage.removeItem('tickets');
      setTickets([]);
    }
  }
};

