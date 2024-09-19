import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/LoginPage.css'; // 스타일 파일 연결
import { login, register } from '../login/authService'; // authService에서 함수 불러오기
import NonLoginOptions from '../login/NavigateBtn'; // 올바른 경로로 수정

function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 기본 동작 방지

    // 핸드폰 번호 유효성 검사: 숫자만 입력되었는지, 1자리에서 11자리까지 허용
    const phoneRegex = /^[0-9]{1,11}$/; // 1자리에서 11자리 숫자 허용
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return alert('유효한 핸드폰 번호를 입력해주세요.');
    }

    // 비밀번호가 입력되었는지 확인
    if (!password) {
      return alert('비밀번호를 입력해주세요.');
    }

    // 로그인 또는 회원가입 처리
    if (phoneNumber && password) {
      if (isLogin) {
        try {
          await login(phoneNumber, password, navigate); // 로그인 처리 함수 호출
        } catch (error) {
          console.error('로그인 실패:', error);
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        try {
          await register(phoneNumber, password, setIsLogin); // 회원가입 처리 함수 호출
        } catch (error) {
          console.error('회원가입 실패:', error);
          alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
      }
    } else {
      alert('모든 필드를 채워주세요.');
    }
  };


  return (
    <div className="login-page-container">
      <h4>간단한 로그인으로 회수권을 등록해보세요.</h4>
      <div className="login-signup-container">
        <h2>{isLogin ? '로그인' : '회원가입'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder="핸드폰 번호"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={isLogin ? 'login-button' : 'signup-button'}>
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>
        <p>
          <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '회원가입으로 전환' : '로그인으로 전환'}
          </button>
        </p>
      </div>
      <NonLoginOptions /> {/* NonLoginOptions 컴포넌트 사용 */}
    </div>
  );
}

export default LoginPage;
