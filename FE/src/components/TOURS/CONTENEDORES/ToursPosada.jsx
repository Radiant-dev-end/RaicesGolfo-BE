import React, { useState, useEffect } from 'react';
import TourCard from '../INFO/TourCard';
import { getTours } from '../../../services/CrudTours';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../common/Pagination';
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

const getTourImage = (tour) => {
  // Si la BD tiene una imagen cargada por el admin (que no sea la URL rota por defecto de github)
  if (tour.imagen && tour.imagen.trim() !== '' && !tour.imagen.includes('github.com/Radiant-dev-end')) {
    return tour.imagen;
  }
  
  // En caso contrario, usamos el asset local optimizado por Vite
  const id = tour.id_tours || tour.id;
  const key = typeof id === 'number' ? `t${String(id).padStart(3, '0')}` : id;
  return IMAGES[key] || posadaImg1;
};

function ToursPosada() {
  const { 
    data: tours, 
    loading, 
    page, 
    setPage, 
    totalPaginas 
  } = usePagination(() => getTours('Posada'), 3); // LIMIT: 3 items per page

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
          ) : tours && tours.length > 0 ? (
            tours.map(tour => (
              <TourCard 
                key={tour.id_tours || tour.id} 
                {...tour} 
                id={tour.id_tours || tour.id}
                imagen={getTourImage(tour)} 
                precio={`$${tour.precio} USD`}
              />
            ))
          ) : (
            <p>No hay tours disponibles en este momento.</p>
          )}
        </div>

        <Pagination 
          paginaActual={page} 
          totalPaginas={totalPaginas} 
          onPageChange={setPage} 
        />
      </div>
    </section>
  );
}

export default ToursPosada;
