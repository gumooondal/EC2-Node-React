// src/components/TicketCard.js
import React from 'react';
import TicketActions from './TicketActions'; // TicketActions 임포트
import { getExpiryDate } from '../util/expriyDate';

const TicketCard = ({ ticket, onDecrement, onDelete }) => (
  <div className="ticket-card" key={ticket.id}>
    <div className="ticket-detail">
      <strong>클라이밍장 :</strong> {ticket.gymName}
    </div>
    <div className="ticket-detail">
      <strong>남은 횟수 :</strong> {ticket.ticketCount}회
    </div>
    <div className="ticket-detail">
      <strong>등록 날짜 :</strong> {ticket.registrationDate}
    </div>
    <div className="ticket-detail">
      <strong>사용기한 :</strong> {getExpiryDate(ticket.registrationDate, ticket.expiry)}
    </div>
    <TicketActions 
      onDecrement={() => onDecrement(ticket.id)}
      onDelete={() => onDelete(ticket.id)}
    />
  </div>
);

export default TicketCard;
