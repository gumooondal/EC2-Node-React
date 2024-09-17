import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="header">
            {isLoggedIn ? (
                <button className="logout-button" onClick={onLogout}>
                    로그아웃
                </button>
            ) : (
                <button className="nonlogin-button" onClick={() => navigate('/')}>
                    비로그인
                </button>
            )}
        </div>
    );
};

export default Header;
