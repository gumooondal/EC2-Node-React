import axios from 'axios';

// handleDelete 함수 정의
export const handleDelete = async (ticketId, isLoggedIn, tickets, setTickets, saveTickets) => {
  console.log('삭제하려는 티켓 ID:', ticketId);
  const isConfirmed = window.confirm('정말 삭제하시겠습니까?');

  if (isConfirmed) {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/ticket-delete/${ticketId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          // 서버에서 성공적으로 삭제된 경우, 로컬 상태에서 티켓 제거
          const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
          setTickets(updatedTickets);
        }
      } catch (error) {
        console.error('Failed to delete ticket from server:', error);
        alert('티켓 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    } else {
      // 비로그인 상태에서 로컬 스토리지에서 티켓 제거
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      saveTickets(updatedTickets);
    }
  }
};
