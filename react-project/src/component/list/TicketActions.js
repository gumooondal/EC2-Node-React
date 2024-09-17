// src/components/TicketActions.js
import React from 'react';

const TicketActions = ({ onDecrement, onDelete }) => (
  <div className="button-container">
    <button onClick={onDecrement} className="decrement-button">차감</button>
    <button onClick={onDelete} className="delete-button">삭제</button>
  </div>
);

export default TicketActions;
