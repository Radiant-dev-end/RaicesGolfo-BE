import React from 'react';
import FoodCard from '../INFO/FoodCard';
import './GastronomiaSection.css';

import comida1 from '../../VIDEOS Y IMG/comida1.jpg';
import comida2 from '../../VIDEOS Y IMG/comida2.jpg';
import comida3 from '../../VIDEOS Y IMG/comida3.jpg';
import comida4 from '../../VIDEOS Y IMG/comida4.jpg';

function GastronomiaPosada() {
  const dishes = [
    {
      id: 1,
      imagen: comida1,
      nombre: 'Casado costarricense',
      precio: '₡3,500 – ₡5,000',
      descripcion: 'El plato tradicional por excelencia. Arroz, frijoles, ensalada fresca, plátano maduro frito y opción de carne o pollo, preparado con el sazón local.',
    },
    {
      id: 2,
      imagen: comida2,
      nombre: 'Gallo pinto (desayuno típico)',
      precio: '₡2,000 – ₡3,500',
      descripcion: 'El desayuno perfecto para empezar el día. Mezcla tradicional de arroz con frijoles acompañado de huevo, queso artesanal o natilla.',
    },
    {
      id: 3,
      imagen: comida3,
      nombre: 'Sopa de mariscos',
      precio: '₡4,000 – ₡6,000',
      descripcion: 'Un caldo reconfortante y lleno de sabor. Sopa preparada con pesca del día, camarones frescos y especias locales que capturan la esencia del golfo.',
    },
    {
      id: 4,
      imagen: comida4,
      nombre: 'Pescado frito con patacones',
      precio: '₡4,000 – ₡6,500',
      descripcion: 'Pescado entero fresco y frito a la perfección, acompañado de crujientes patacones (plátano verde frito) y una refrescante ensalada.',
    }
  ];

  return (
    <section id="gastro-posada" className="gastro-section posada-bg">
      <div className="gastro-container">
        <div className="gastro-header">
          <h2 className="gastro-title">Gastronomía Posada Rural La Amistad</h2>
          <div className="gastro-divider"></div>
          <p className="gastro-subtitle">
            Saborea la auténtica cocina costarricense con ingredientes frescos de la zona. Disfruta de platos tradicionales preparados con amor y sazón criollo.
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

export default GastronomiaPosada;
