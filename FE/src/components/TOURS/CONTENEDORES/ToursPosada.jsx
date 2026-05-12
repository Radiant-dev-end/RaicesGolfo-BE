import React, { useState, useEffect } from 'react';
import TourCard from '../INFO/TourCard';
import { getTours } from '../../../services/CrudTours';
import './ToursSection.css'; // Shared CSS for both sections

import posadaImg1 from '../../VIDEOS Y IMG/posada1.jpg';
import posadaImg2 from '../../VIDEOS Y IMG/posada2.jpg';
import posadaImg3 from '../../VIDEOS Y IMG/posada3.jpg';
import posadaImg4 from '../../VIDEOS Y IMG/posada4.jpg';

const IMAGES = {
  't001': posadaImg1,
  't002': posadaImg2,
  't003': posadaImg3,
  't004': posadaImg4,
};

function ToursPosada() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
        // Filter only Posada tours
        setTours(data.filter(t => t.tipo === 'Posada' && t.disponible));
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <section id="tours-posada" className="tours-section posada-bg">
      <div className="tours-container">
        <div className="tours-header">
          <h2 className="tours-title">Tours Posada Rural La Amistad</h2>
          <div className="tours-divider"></div>
          <p className="tours-subtitle">
            Descubre la esencia del Golfo de Nicoya a través de nuestras experiencias diseñadas para conectar con la naturaleza y la cultura local.
          </p>
        </div>
        
        <div className="tours-grid">
          {loading ? (
            <p>Cargando tours...</p>
          ) : tours.length > 0 ? (
            tours.map(tour => (
              <TourCard 
                key={tour.id} 
                {...tour} 
                imagen={tour.imagen || IMAGES[tour.id] || posadaImg1} 
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

export default ToursPosada;
