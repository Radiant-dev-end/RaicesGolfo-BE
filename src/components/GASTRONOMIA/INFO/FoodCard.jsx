import React from 'react';
import './FoodCard.css';

function FoodCard({ imagen, nombre, descripcion, precio }) {
  return (
    <div className="food-card">
      <div className="food-card-image-wrapper">
        <img src={imagen} alt={nombre} className="food-card-image" />
      </div>
      <div className="food-card-content">
        <h3 className="food-card-title">{nombre}</h3>
        <p className="food-card-description">{descripcion}</p>
        <div className="food-card-footer">
          <div className="food-card-price">
            <span className="price-label">Precio</span>
            <span className="price-value">{precio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
