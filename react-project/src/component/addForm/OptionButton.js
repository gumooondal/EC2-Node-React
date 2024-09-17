import React from 'react';

const OptionButton = ({ label, isSelected, onClick }) => (
    <div
        className={`option ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
    >
        {label}
    </div>
);

export default OptionButton;
