import axios from 'axios';
//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const handleDecrement = async (ticketId, tickets, setTickets, isLoggedIn, saveTickets) => {
  console.log('차감하려는 티켓 ID :', ticketId);
  console.log('Before update, tickets :', tickets);

  // 티켓 차감 처리
  const updatedTickets = tickets.map(ticket => {
    if (ticket.id === ticketId) {
      const updatedTicket = { ...ticket, ticketCount: ticket.ticketCount - 1 };

      if (updatedTicket.ticketCount <= 0) {
        console.log('Ticket count is zero or less, removing ticket:', updatedTicket);
        return null;
      }

      console.log('Updated ticket:', updatedTicket);
      return updatedTicket;
    }
    return ticket;
  }).filter(ticket => ticket !== null);

  console.log('After update, updatedTickets:', updatedTickets);

  if (isLoggedIn) {
    // 로그인 상태일 때 서버로 요청을 보내기
    try {
      const token = localStorage.getItem('token');
      
      // 선택된 ticketId에 해당하는 티켓만 찾기
      const selectedTicket = tickets.find(ticket => ticket.id === ticketId);
      
      if (!selectedTicket) {
        throw new Error('해당 티켓을 찾을 수 없습니다.');
      }
      
      // 해당 티켓만 서버에 보내기
      await axios.patch(`api/ticket-update/`+`${ticketId}`, 
        { ticket: selectedTicket }, // 전체가 아닌 선택된 티켓 정보만 보내기
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Ticket updated on server');
      
      // 서버 업데이트 성공 시에만 상태를 업데이트
      setTickets(updatedTickets);
    } catch (error) {
      console.error('Failed to update ticket on server:', error);
      alert('티켓 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  } else {
    // 비로그인 상태에서는 로컬에서만 티켓 업데이트
    setTickets(updatedTickets);
    saveTickets(updatedTickets);
  }
};
