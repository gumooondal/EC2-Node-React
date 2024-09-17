import axios from 'axios';

export const login = async (phoneNumber, password, navigate) => {
  try {
    const response = await axios.post(`/api/login`, {
      phoneNumber,
      password,
    });

    console.log('로그인 응답:', response.data);
    localStorage.setItem('token', response.data.token);
    navigate('/ticket-list'); // 로그인 성공 시 페이지 이동
  } catch (error) {
    console.error('로그인 실패:', error);
    alert('로그인에 실패했습니다. 다시 시도해주세요.');
  }
};

export const register = async (phoneNumber, password, setIsLogin) => {
  try {
    const response = await axios.post('/api/register', {
      phoneNumber,
      password,
    });

    console.log('회원가입 응답:', response.data);
    alert('회원가입이 완료되었습니다. 이제 로그인하세요.');
    setIsLogin(true); // 회원가입 후 로그인 폼으로 전환
  } catch (error) {
    console.error('회원가입 실패:', error);
    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
  }
};
