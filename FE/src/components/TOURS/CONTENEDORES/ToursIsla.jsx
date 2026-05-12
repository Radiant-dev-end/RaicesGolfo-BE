import React, { useState, useEffect } from 'react';
import TourCard from '../INFO/TourCard';
import { getTours } from '../../../services/CrudTours';
// Reusing ToursSection.css

import islaImg1 from '../../VIDEOS Y IMG/isla1.jpg';
import islaImg2 from '../../VIDEOS Y IMG/isla2.jpg';
import islaImg3 from '../../VIDEOS Y IMG/isla3.jpg';
import islaImg4 from '../../VIDEOS Y IMG/isla4.jpg';
import islaImg5 from '../../VIDEOS Y IMG/isla5.jpg';

const IMAGES = {
  't005': islaImg1,
  't006': islaImg2,
  't007': islaImg3,
  't008': islaImg4,
  't009': islaImg5,
};

function ToursIsla() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
        // Filter only Isla tours
        setTours(data.filter(t => t.tipo === 'Isla' && t.disponible));
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <section id="tours-isla" className="tours-section isla-bg">
      <div className="tours-container">
        <div className="tours-header">
          <h2 className="tours-title">Tours Isla Venado</h2>
          <div className="tours-divider"></div>
          <p className="tours-subtitle">
            Aventúrate por la Isla Venado con nuestras actividades diseñadas para todas las edades.
          </p>
        </div>
        
        <div className="tours-grid isla-grid">
          {loading ? (
            <p>Cargando tours...</p>
          ) : tours.length > 0 ? (
            tours.map(tour => (
              <TourCard 
                key={tour.id} 
                {...tour} 
                imagen={tour.imagen || IMAGES[tour.id] || islaImg1} 
                precio={`$${tour.precio} USD`}
              />
            ))
          ) : (
            <p>No hay tours disponibles en este momento.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ToursIsla;
