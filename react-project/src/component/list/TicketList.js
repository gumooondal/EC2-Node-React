// src/components/TicketList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/TicketList.css';
import Header from './Header';
import { handleReset } from '../util/handleReset';
import { handleDelete } from '../util/handleDelete';
import { fetchTicketsFromServer } from '../util/ticketServer';
import { fetchTicketsFromLocalStorage } from '../util/ticketLocal';
import { handleDecrement } from '../util/handleDecrement';
import TicketCard from './TicketCard';
import ResetButton from './ResetButton';
import axios from 'axios';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchTicketsFromServer(token, setTickets, setUserPhoneNumber);
    } else {
      setIsLoggedIn(false);
      fetchTicketsFromLocalStorage(setTickets);
    }
  }, []);

  const decrementClick = (ticketId) => {
    handleDecrement(ticketId, tickets, setTickets, isLoggedIn, saveTickets);
  };

  const deleteClick = (ticketId) => {
    handleDelete(ticketId, isLoggedIn, tickets, setTickets, saveTickets);
  };

  const resetClick = () => {
    if (isLoggedIn) {
      // 로그인 상태에서 userPhoneNumber가 필요한 경우
      if (userPhoneNumber) {
        handleReset(isLoggedIn, userPhoneNumber, setTickets); // 올바른 인자 전달
      } else {
        console.warn('User phone number is not set.');
      }
    } else {
      // 비로그인 상태에서 호출
      handleReset(isLoggedIn, null, setTickets); // 로그인 상태가 아니므로 userPhoneNumber는 null
    }
  };
  
  const saveTickets = (updatedTickets) => {
    if (!isLoggedIn) {
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    }
    setTickets(updatedTickets);
  };

  const handleLogout = async () => {
    try {
      // 서버로 로그아웃 요청 보내기
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      
      // 페이지 이동
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  

  return (
    <div className="ticket-list-container">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <h2>회수권 리스트</h2>
      {isLoggedIn && tickets.length > 0 && (
        <ResetButton onClick={resetClick} />
      )}
        {!isLoggedIn && tickets.length > 0 && (
        <ResetButton onClick={resetClick} />
      )}
      <div className="ticket-list">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <TicketCard 
              key={ticket.id}
              ticket={ticket}
              onDecrement={() => decrementClick(ticket.id)}
              onDelete={() => deleteClick(ticket.id)}
            />
          ))
        ) : (
          <p>등록된 회수권이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default TicketList;
