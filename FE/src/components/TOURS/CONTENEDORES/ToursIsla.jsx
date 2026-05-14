import React, { useState, useEffect } from 'react';
import TourCard from '../INFO/TourCard';
import { getTours } from '../../../services/CrudTours';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../common/Pagination';
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
  const { 
    data: tours, 
    loading, 
    page, 
    setPage, 
    totalPaginas 
  } = usePagination(() => getTours('Isla'), 3); // LIMIT: 3 items per page

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
          ) : tours && tours.length > 0 ? (
            tours.map(tour => (
              <TourCard 
                key={tour.id_tours || tour.id} 
                {...tour} 
                id={tour.id_tours || tour.id}
                imagen={tour.imagen || IMAGES[tour.id_tours || tour.id] || islaImg1} 
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

export default ToursIsla;
