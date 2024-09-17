// src/components/ResetButton.js
import React from 'react';

const ResetButton = ({ onClick }) => (
  <div className="reset-button-container">
    <button onClick={onClick} className="reset-button">초기화</button>
  </div>
);

export default ResetButton;
