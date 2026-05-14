import React from 'react';
import './Pagination.css';

const Pagination = ({ paginaActual, totalPaginas, onPageChange }) => {
  if (totalPaginas <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPaginas; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-container">
      <button 
        className="pagination-arrow" 
        onClick={() => onPageChange(paginaActual - 1)}
        disabled={paginaActual === 1}
      >
        <span className="chevron left"></span>
      </button>
      
      <div className="pagination-numbers">
        {pages.map(page => (
          <button
            key={page}
            className={`pagination-number ${page === paginaActual ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button 
        className="pagination-arrow" 
        onClick={() => onPageChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
      >
        <span className="chevron right"></span>
      </button>
    </div>
  );
};

export default Pagination;
