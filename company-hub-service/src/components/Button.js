import React from 'react';

const Button = ({ children, onClick, type = 'button', className }) => {
  return (
    <button type={type} className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
