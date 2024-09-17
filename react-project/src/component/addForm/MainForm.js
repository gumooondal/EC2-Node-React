import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/TicketAddForm.css';
import InputField from './InputField';
import OptionButton from './OptionButton';
import Header from './Header';
import axios from 'axios';

function TicketAddForm() {
    const [gymName, setGymName] = useState('');
    const [registrationDate, setRegistrationDate] = useState('');
    const [selectedCount, setSelectedCount] = useState('');
    const [customCount, setCustomCount] = useState('');
    const [expiry, setExpiry] = useState('');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-CA');
        setRegistrationDate(formattedDate);

        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, [isLoggedIn]);

    const handleRegister = async () => {
        const ticketCount = selectedCount || customCount;

        if (!gymName || !ticketCount || !registrationDate || !expiry) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        const newTicket = {
            gymName,
            ticketCount,
            registrationDate,
            expire: expiry
        };

        if (isLoggedIn) {
            // 로그인 상태에서 서버에 데이터 저장 (ID는 서버에서 생성)
            try {
                const token = localStorage.getItem('token');
                await axios.post('/api/ticket-add', newTicket, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('회수권이 등록되었습니다!');
                navigate('/ticket-list');
            } catch (error) {
                console.error('회수권 등록 실패:', error);
                alert('회수권 등록에 실패했습니다. 다시 시도해주세요.');
            }
        } else {
            // 비로그인 상태에서 로컬 스토리지에 고유 ID를 부여하여 저장
            const existingTickets = JSON.parse(localStorage.getItem('tickets')) || [];
            const ticketWithId = { ...newTicket, id: Date.now() }; // 로컬에서 고유 ID 부여
            existingTickets.push(ticketWithId);
            localStorage.setItem('tickets', JSON.stringify(existingTickets));
            alert('회수권이 등록되었습니다!');
            navigate('/ticket-list');
        }
    };

    const handleCustomCountChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) {
            alert('숫자만 입력 가능합니다.');
        } else {
            setCustomCount(value);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className="app-container">
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <div className="ticket-form">
                <h2>회수권 등록</h2>
                <InputField
                    type="text"
                    placeholder="클라이밍장 이름"
                    value={gymName}
                    onChange={(e) => {
                        setGymName(e.target.value);
                        if (e.target.value.length > 15) {
                            alert('클라이밍장 이름은 15자 이하로 입력해주세요.');
                        }
                    }}
                />
                <div className="ticket-count-options">
                    <OptionButton
                        label="3회"
                        isSelected={selectedCount === '3'}
                        onClick={() => setSelectedCount('3')}
                    />
                    <OptionButton
                        label="5회"
                        isSelected={selectedCount === '5'}
                        onClick={() => setSelectedCount('5')}
                    />
                    <OptionButton
                        label="10회"
                        isSelected={selectedCount === '10'}
                        onClick={() => setSelectedCount('10')}
                    />
                    <OptionButton
                        label="직접 입력"
                        isSelected={selectedCount === ''}
                        onClick={() => setSelectedCount('')}
                    />
                </div>
                {selectedCount === '' && (
                    <InputField
                        type="text"
                        placeholder="직접 입력"
                        value={customCount}
                        onChange={handleCustomCountChange}
                    />
                )}
                <InputField
                    type="date"
                    placeholder="등록 날짜"
                    value={registrationDate}
                    onChange={(e) => setRegistrationDate(e.target.value)}
                />
                <div className="expiry-options">
                    <OptionButton
                        label="3개월"
                        isSelected={expiry === '3개월'}
                        onClick={() => setExpiry('3개월')}
                    />
                    <OptionButton
                        label="6개월"
                        isSelected={expiry === '6개월'}
                        onClick={() => setExpiry('6개월')}
                    />
                    <OptionButton
                        label="7개월"
                        isSelected={expiry === '7개월'}
                        onClick={() => setExpiry('7개월')}
                    />
                    <OptionButton
                        label="1년"
                        isSelected={expiry === '1년'}
                        onClick={() => setExpiry('1년')}
                    />
                </div>
                <button onClick={handleRegister}>등록</button>
            </div>
        </div>
    );
}

export default TicketAddForm;
