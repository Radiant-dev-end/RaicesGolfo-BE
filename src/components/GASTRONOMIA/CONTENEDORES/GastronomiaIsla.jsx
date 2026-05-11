import React from 'react';
import FoodCard from '../INFO/FoodCard';
import './GastronomiaSection.css';

import marisco1 from '../../VIDEOS Y IMG/marisco1.jpg';
import marisco2 from '../../VIDEOS Y IMG/marisco2.jpg';
import marisco3 from '../../VIDEOS Y IMG/marisco3.jpg';
import marisco4 from '../../VIDEOS Y IMG/marisco4.jpg';

function GastronomiaIsla() {
  const dishes = [
    {
      id: 1,
      imagen: marisco1,
      nombre: 'Ceviche de pescado',
      precio: '₡3,000 – ₡5,000',
      descripcion: 'Refrescante y cítrico. Pescado fresco del golfo picado finamente y marinado en jugo de limón con culantro, cebolla y especias locales.',
    },
    {
      id: 2,
      imagen: marisco2,
      nombre: 'Arroz con mariscos',
      precio: '₡4,000 – ₡6,500',
      descripcion: 'Una explosión de sabores del mar. Arroz amarillo tradicional preparado con una rica selección de mariscos frescos extraídos por pescadores de la zona.',
    },
    {
      id: 3,
      imagen: marisco3,
      nombre: 'Mariscada',
      precio: '₡6,000 – ₡10,000',
      descripcion: 'El plato estelar para los amantes del mar. Una generosa mezcla de camarones, pescado, moluscos y otros mariscos servidos en una salsa especial.',
    },
    {
      id: 4,
      imagen: marisco4,
      nombre: 'Pescado entero a la parrilla',
      precio: '₡5,000 – ₡8,000',
      descripcion: 'Pescado fresco del día, marinado con hierbas locales y asado a la parrilla, manteniendo todo su jugo y sabor. Se sirve con acompañamientos tradicionales.',
    }
  ];

  return (
    <section id="gastro-isla" className="gastro-section isla-bg">
      <div className="gastro-container">
        <div className="gastro-header">
          <h2 className="gastro-title">Gastronomía Isla Venado</h2>
          <div className="gastro-divider"></div>
          <p className="gastro-subtitle">
            Delicias extraídas directamente del Golfo de Nicoya. Nuestra especialidad son los mariscos frescos y los sabores vibrantes de la costa pacífica.
          </p>
        </div>
        
        <div className="gastro-grid">
          {dishes.map(dish => (
            <FoodCard key={dish.id} {...dish} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default GastronomiaIsla;
