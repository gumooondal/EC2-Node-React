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
            try {
                const token = localStorage.getItem('token');
                await axios.post('/api/ticket-add', newTicket, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Google Analytics 이벤트 기록
                if (window.gtag) {
                    window.gtag('event', 'ticket_add', {
                        event_category: 'Ticket',
                        event_label: 'Ticket Added',
                        value: 1
                    });
                }

                alert('회수권이 등록되었습니다!');
                navigate('/ticket-list');
            } catch (error) {
                if (error.response) {
                    // 서버에서 응답한 에러 코드 및 메시지 처리
                    if (error.response.status === 400) {
                        const message = error.response.data.message;

                        // 입력값 오류
                        if (message === '모든 필드를 채워주세요.') {
                            alert('모든 필드를 채워주세요.');
                        } else if (message === '클라이밍장 이름이 유효하지 않습니다.') {
                            alert('클라이밍장 이름이 유효하지 않습니다. 특수 문자를 포함하거나 15자를 넘길 수 없습니다.');
                        } else if (message === '티켓 수량이 유효하지 않습니다.') {
                            alert('티켓 수량이 올바르지 않습니다. 숫자 형식으로 입력해주세요.');
                        } else if (message === '티켓은 최대 10개까지만 등록할 수 있습니다.') {
                            alert('회수권은 최대 10개까지만 등록할 수 있습니다.');
                        } else if (message === '등록일이 올바른 형식이 아닙니다.') {
                            alert('등록일이 올바른 날짜 형식이 아닙니다. 날짜를 다시 확인해주세요.');
                        } else {
                            alert('잘못된 요청입니다.');
                        }
                    } else if (error.response.status === 500) {
                        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                    } else {
                        alert('알 수 없는 오류가 발생했습니다.');
                    }
                } else {
                    // 네트워크 에러 등 서버 응답이 없는 경우
                    alert('회수권 등록에 실패했습니다. 네트워크 상태를 확인해주세요.');
                }
                console.error('회수권 등록 실패:', error);
            }
        } else {
            // 비로그인 상태에서 로컬 스토리지에 고유 ID를 부여하여 저장
            const existingTickets = JSON.parse(localStorage.getItem('tickets')) || [];
            const ticketWithId = { ...newTicket, id: Date.now() }; // 로컬에서 고유 ID 부여
            existingTickets.push(ticketWithId);
            localStorage.setItem('tickets', JSON.stringify(existingTickets));

            // Google Analytics 이벤트 기록
            if (window.gtag) {
                window.gtag('event', 'ticket_add', {
                    event_category: 'Ticket',
                    event_label: 'Ticket Added (Local Storage)',
                    value: 1
                });
            }

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
