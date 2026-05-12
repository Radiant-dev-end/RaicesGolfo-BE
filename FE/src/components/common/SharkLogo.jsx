import React from 'react';
import './SharkLogo.css';

const SharkLogo = ({ className = "", color = "currentColor", suffix = "" }) => {
  return (
    <div className={`shark-logo-container ${className}`}>
      <div className="shark-wrapper">
        <svg 
          viewBox="0 0 200 45" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="shark-fin-svg"
        >
          <path 
            d="M5 35 Q 80 32 140 32 L 160 5 L 175 35 Q 185 36 195 38" 
            stroke={color} 
            strokeWidth="3" 
            strokeLinecap="round" 
            fill="none"
          />
        </svg>
        <div className="logo-text-wrapper">
          <span className="logo-text-main" style={{ color: color }}>Raíces del Golfo</span>
          {suffix && <span className="logo-suffix" style={{ backgroundColor: color }}>{suffix}</span>}
        </div>
      </div>
    </div>
  );
};

export default SharkLogo;
